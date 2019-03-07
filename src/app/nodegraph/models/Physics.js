import { decorate, observable, values } from "mobx";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3";
import Vector2D from "../../core/Vector2D";
import BodyNode from "./BodyNode";
import BodyEdge from "./BodyEdge";

export default class Physics
{
	constructor( tGraph )
	{
		// Variables
		this._graph = tGraph;
		this._isEnabled = true;
		this._nodes = null; // physics objects
		this._nodesHash = null;
		this._edges = null; // physics objects
		this._edgesHash = null;
		
		this._simulation = forceSimulation();
		this._simulation.velocityDecay( 0.7 );
		this._simulation.alphaDecay( 0.01 );
		this._simulation.force( "charge", this.createChargeForce() );
		this._simulation.force( "collide", this.createCollideForce() );
		this._simulation.force( "link", this.createLinkForce() );
		this._simulation.on( "tick", () => { this.onTick(); } );
		
		// Initialize
		this.seedCenter();
		this.handleEnabled();
	}
	
	destroy()
	{
		this.clearBodies();
	}
	
	clearBodies()
	{
		// Stop
		this._simulation.stop();
		
		// Nodes
		if ( this._nodes !== null )
		{
			for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
			{
				this._nodes[i].destroy();
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
	
	onTick()
	{
		for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
		{
			let tempNode = this._nodes[i];
			tempNode._model.position = new Vector2D( tempNode.x, tempNode.y );
		}
	}
	
	seedCenter()
	{
		this._simulation.force( "center", this.createCenterForce() );
		
		setTimeout(
			() =>
			{
				this._simulation.force( "center", null );
			},
			2000
		);
	}
	
	restart()
	{
		if ( this._isEnabled )
		{
			this._simulation.alpha( 1 ).restart();
		}
	}
	
	createChargeForce()
	{
		return forceManyBody().strength( -500 ).distanceMax( 750 );
	}
	
	createCollideForce()
	{
		return forceCollide(
			( tNode ) =>
			{
				return tNode._model._type.radius * 1.5;
			}
		);
	}
	
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
	
	createCenterForce()
	{
		return forceCenter( ( ( window.screen.width * 0.5 ) / this._graph.zoom ) - this._graph.position.x, ( ( window.screen.height * 0.5 ) / this._graph.zoom ) - this._graph.position.y );
	}
	
	set isEnabled( tIsEnabled )
	{
		if ( tIsEnabled !== this._isEnabled )
		{
			this._isEnabled = tIsEnabled;
			this.handleEnabled();
		}
	}
	
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
			}
		}
	}
	
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
			}
		}
	}
	
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
	
	onSelectNode( tNodeModel )
	{
		if ( this._nodesHash !== null )
		{
			const tempBody = this._nodesHash[ tNodeModel._id ];
			if ( tempBody !== undefined )
			{
				tempBody.isFrozen = true;
			}
		}
	}
	
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
	
	onDragStart()
	{
		if ( this._isEnabled )
		{
			this._simulation.alphaTarget( 0.3 ).restart();
		}
	}
	
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