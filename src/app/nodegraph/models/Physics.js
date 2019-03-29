import { decorate, observable, values } from "mobx";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3";
import Vector2D from "../../core/Vector2D";
import BodyNode from "./BodyNode";
import BodyEdge from "./BodyEdge";

/**
*	Physics system for auto-placement using D3 force layout
*	@memberof nodegraph
*	@param {Node} tGraph Graph model that this system belongs to
*/
export default class Physics
{
	constructor( tGraph )
	{
		/**
		*	Graph model that this system belongs to
		*	@type {Graph}
		*/
		this._graph = tGraph;
		/**
		*	True if physics is running
		*	@type {bool}
		*/
		this._isEnabled = true;
		/**
		*	Array of node physics bodies
		*	@type {BodyNode[]}
		*/
		this._nodes = null;
		/**
		*	Associative array of node physics bodies used for optimization
		*	@type {Object}
		*/
		this._nodesHash = null;
		/**
		*	Array of edge physics bodies
		*	@type {BodyEdge[]}
		*/
		this._edges = null;
		/**
		*	Associative array of edge physics bodies used for optimization
		*	@type {Object}
		*/
		this._edgesHash = null;
		/**
		*	Timeout ID used for seeding a center force
		*	@type {number}
		*/
		this._seedCenterTimeout = null;
		/**
		*	D3 physics simulation
		*	@type {Graph}
		*/
		this._simulation = forceSimulation();
		
		// Initialize
		this._alphaDecay = this._simulation.alphaDecay();
		this._velocityDecay = 0.7;
		this._simulation.velocityDecay( this._velocityDecay );
		this._simulation.force( "charge", this.createChargeForce() );
		this._simulation.force( "collide", this.createCollideForce() );
		this._simulation.force( "link", this.createLinkForce() );
		this._simulation.on( "tick", () => { this.onTick(); } );
		this._simulation.stop();
		
		this.seedCenter();
		this.handleEnabled();
	}
	
	/**
	*	Clears all physics bodies and the center force timeout if active
	*/
	clear()
	{
		this.clearBodies();
		
		if ( this._seedCenterTimeout !== null )
		{
			clearTimeout( this._seedCenterTimeout );
			this._seedCenterTimeout = null;
		}
	}
	
	/**
	*	Clears all physics bodies
	*/
	clearBodies()
	{
		// Stop
		this._simulation.stop();
		
		// Nodes
		if ( this._nodes !== null )
		{
			for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
			{
				this._nodes[i].clear();
			}
			
			this._nodes = null;
			this._nodesHash = null;
			this.setNodeBodies( this._nodes );
		}
		
		// Edges
		if ( this._edges !== null )
		{
			this._edges = null;
			this._edgesHash = null;
			this._simulation.force( "link" ).links( [] );
		}
	}
	
	/**
	*	Step tick method of the physics simulation, updates node positions
	*/
	onTick()
	{
		for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
		{
			let tempNode = this._nodes[i];
			tempNode._model.position = new Vector2D( tempNode.x, tempNode.y );
		}
	}
	
	/**
	*	Seeds a temporary center force placed in the current middle of the screen
	*/
	seedCenter()
	{
		this._simulation.velocityDecay( 0.15 );
		this._simulation.alphaDecay( 0.01 );
		
		const tempChargeTheta = this._simulation.force( "charge" ).theta();
		this._simulation.force( "charge" ).theta( 100 );
		this._simulation.force( "center", this.createCenterForce() );
	
		if ( this._seedCenterTimeout !== null )
		{
			clearTimeout( this._seedCenterTimeout );
		}
		
		this._seedCenterTimeout = setTimeout(
			() =>
			{
				this._simulation.velocityDecay( this._velocityDecay );
				this._simulation.alphaDecay( this._alphaDecay );
				this._simulation.force( "charge" ).theta( tempChargeTheta );
				this._simulation.force( "center", null );
				this._seedCenterTimeout = null;
			},
			3000
		);
	}
	
	/**
	*	Restarts the simulation if enabled
	*/
	restart()
	{
		if ( this._isEnabled && this._nodes !== null )
		{
			this._simulation.alpha( 1 ).restart();
		}
	}
	
	/**
	*	Factory method for creating the charge/repel force
	*	@return {forceManyBody} Many body force
	*/
	createChargeForce()
	{
		return forceManyBody().strength( -500 ).distanceMax( 2000 );
	}
	
	/**
	*	Factory method for creating the collision force
	*	@return {forceCollide} Collider force
	*/
	createCollideForce()
	{
		return forceCollide(
			( tNode ) =>
			{
				return tNode._model._type.radius * 1.5;
			}
		);
	}
	
	/**
	*	Factory method for creating the link force which is less effective if an edge has a low weight
	*	@return {forceLink} Link force
	*/
	createLinkForce()
	{
		return forceLink().id(
			( tNode ) =>
			{
				return tNode._model._id;
			}
		).distance(
			( tLink ) =>
			{
				if ( tLink._model.weight < 5 )
				{
					return ( ( 300 - 700 ) * 0.2 * tLink._model.weight ) + 380; // 5 is max length is min 300... length of 0 is max 700
				}
				
				return 300; // min
			}
		).strength( 0.7 );
	}
	
	/**
	*	Factory method for creating the center force to be in the middle of the screen
	*	@return {forceCenter} Center force
	*/
	createCenterForce()
	{
		return forceCenter( ( ( window.screen.width * 0.5 ) / this._graph.zoom ) - this._graph.position.x, ( ( window.screen.height * 0.5 ) / this._graph.zoom ) - this._graph.position.y );
	}
	
	/**
	*	Toggles physics system
	*	@param {bool} tIsEnabled Set to true if enabled
	*/
	set isEnabled( tIsEnabled )
	{
		if ( tIsEnabled !== this._isEnabled )
		{
			this._isEnabled = tIsEnabled;
			this.handleEnabled();
		}
	}
	
	/**
	*	Handler called whenever toggled, adds physics bodies if enabled and removes if disabled
	*/
	handleEnabled()
	{
		if ( this._isEnabled )
		{
			this._simulation.stop();
			
			// Nodes
			const tempNodes = values( this._graph._nodes );
			var tempListLength = tempNodes.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				this.onSetNode( tempNodes[i] );
			}
			
			// Edges (oof expensive because d3 doesn't like dynamic data! might consider refactoring links hash in graph model and straight array of links in pin)
			if ( this._nodes !== null )
			{
				tempListLength = this._nodes.length;
				for ( let i = ( tempListLength - 1 ); i >= 0; --i )
				{
					let tempPins = values( this._nodes[i]._model._pins );
					for ( let j = ( tempPins.length - 1 ); j >= 0; --j )
					{
						let tempPin = tempPins[j];
						if ( tempPin._isOut )
						{
							let tempLinks = values( tempPin._links );
							for ( let k = ( tempLinks.length - 1 ); k >= 0; --k )
							{
								this.onSetEdge( tempLinks[k] );
							}
						}
					}
				}
				
				this._simulation.restart();
			}
		}
		else
		{
			this.clearBodies();
		}
	}
	
	/**
	*	Handler that gets called when a node model is added to the graph. Will create a new physics body and add it to the physics system.
	*	@param {Node} tNodeModel Node model
	*	@return {bool} True if set
	*/
	onSetNode( tNodeModel )
	{
		if ( this._isEnabled )
		{
			if ( this._nodes === null )
			{
				this._nodes = [];
				this._nodesHash = {};
			}
			
			if ( this._nodesHash[ tNodeModel._id ] === undefined )
			{
				const tempBody = new BodyNode( tNodeModel );
				this._nodesHash[ tNodeModel._id ] = tempBody;
				this._nodes.push( tempBody );
				
				tempBody.isFrozen = tNodeModel._isSelected;
				
				this.setNodeBodies( this._nodes );
				
				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Handler that gets called when a node model is removed from the graph. Will remove the physics body from the system.
	*	@param {Node} tNodeModel Node model
	*	@return {bool} True if removed
	*/
	onRemoveNode( tNodeModel )
	{
		if ( this._nodesHash !== null )
		{
			const tempBody = this._nodesHash[ tNodeModel._id ];
			if ( tempBody !== undefined )
			{
				// Nodes
				this._nodes.splice( tempBody.index, 1 );
				if ( this._nodes.length === 0 )
				{
					this._nodes = null;
					this._nodesHash = null;
				}
				else
				{
					delete this._nodesHash[ tNodeModel._id ];
				}
				
				this.setNodeBodies( this._nodes );
				
				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Pauses physics processing and Ingests node physics bodies into the system
	*	@param {BodyNode[]} tNodeBodies Array of node physics bodies
	*/
	setNodeBodies( tNodeBodies )
	{
		if ( tNodeBodies == null )
		{
			this._simulation.stop();
			this._simulation.nodes( [] );
		}
		else
		{
			// Preserve positions (d3 is hacky)
			const tempPositions = [];
			tempPositions.length = tNodeBodies.length;
			for ( let i = ( tempPositions.length - 1 ); i >= 0; --i )
			{
				tempPositions[i] = tNodeBodies[i]._model.position;
			}
			
			this._simulation.nodes( tNodeBodies ); // has to reindex every time
			
			// Restore positions
			for ( let i = ( tempPositions.length - 1 ); i >= 0; --i )
			{
				tNodeBodies[i].x = tempPositions[i].x;
				tNodeBodies[i].y = tempPositions[i].y;
			}
		}
	}
	
	/**
	*	Handler that gets called when a node model is selected. Will attempt to freeze its physics body.
	*	@param {Node} tNodeModel Node model
	*	@return {bool} True if frozen
	*/
	onSelectNode( tNodeModel )
	{
		if ( this._nodesHash !== null )
		{
			const tempBody = this._nodesHash[ tNodeModel._id ];
			if ( tempBody !== undefined )
			{
				tempBody.isFrozen = true;
				
				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Handler that gets called when a node model is deselected. Will attempt to unfreeze its physics body.
	*	@param {Node} tNodeModel Node model
	*	@return {bool} True if unfrozen
	*/
	onDeselectNode( tNodeModel )
	{
		if ( this._nodesHash !== null )
		{
			const tempBody = this._nodesHash[ tNodeModel._id ];
			if ( tempBody !== undefined )
			{
				tempBody.isFrozen = false;
			}
		}
	}
	
	/**
	*	Handler that gets called when an edge model is added to a pin. Will create a new physics body and add it to the physics system.
	*	@param {Edge} tEdgeModel Edge model
	*	@return {bool} True if set
	*/
	onSetEdge( tEdgeModel )
	{
		if ( this._isEnabled )
		{
			if ( this._edges === null )
			{
				this._edges = [];
				this._edgesHash = {};
			}
			
			const tempID = tEdgeModel.id;
			if ( this._edgesHash[ tempID ] === undefined )
			{
				const tempBody = new BodyEdge( tEdgeModel );
				this._edgesHash[ tempID ] = tempBody;
				this._edges.push( tempBody );
				
				this._simulation.force( "link" ).links( this._edges );
			}
		}
	}
	
	/**
	*	Handler that gets called when a node model is removed from a pin. Will remove the physics body from the system.
	*	@param {Edge} tEdgeModel Edge model
	*	@return {bool} True if removed
	*/
	onRemoveEdge( tEdgeModel )
	{
		if ( this._edgesHash !== null )
		{
			const tempID = tEdgeModel.id;
			const tempBody = this._edgesHash[ tempID ];
			if ( tempBody !== undefined )
			{
				this._edges.splice( tempBody.index, 1 );
				if ( this._edges.length === 0 )
				{
					this._edges = null;
					this._edgesHash = null;
					
					this._simulation.force( "link" ).links( [] );
				}
				else
				{
					delete this._edgesHash[ tempID ];

					this._simulation.force( "link" ).links( this._edges );
				}
			}
		}
	}
	
	/**
	*	Handler that gets called at the start of dragging a node selection. Will heat up the physics simulation.
	*/
	onDragStart()
	{
		if ( this._isEnabled )
		{
			this._simulation.alphaTarget( 0.3 ).restart();
		}
	}
	
	/**
	*	Handler that gets called at the end of dragging a node selection. Will cool off the physics simulation.
	*/
	onDragEnd()
	{
		if ( this._isEnabled )
		{
			this._simulation.alphaTarget( 0 );
		}
	}
}

decorate( Physics,
	{
		_isEnabled: observable
	}
);