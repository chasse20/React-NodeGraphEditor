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
		this._simulation.velocityDecay( 0.5 );
		this._simulation.force( "charge", this.createChargeForce() );
		this._simulation.force( "collide", this.createCollideForce() );
		this._simulation.force( "center", this.createCenterForce() );
		this._simulation.force( "link", this.createLinkForce() );
		this._simulation.on( "tick", () => { this.onTick(); } );
		
		// Initialize
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
			this._simulation.nodes( [] );
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
	
	restart()
	{
		if ( this._isEnabled )
		{
			this._simulation.alpha( 1 ).restart();
		}
	}
	
	createChargeForce()
	{
		return forceManyBody().strength( -35 ).distanceMax( 500 );
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
					return ( ( 250 - 750 ) * 0.2 * tLink._model.weight ) + 400; // 5 is max length is min 250... length of 0 is max 750
				}
				
				return 250; // min
			}
		).strength( 0.4 );
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
			for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
			{
				this.onSetNode( tempNodes[i] );
			}
			
			// Edges (oof expensive because d3 doesn't like dynamic data! might consider refactoring links hash in graph model and straight array of links in pin)
			if ( this._nodes !== null )
			{
				for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
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
				
				this.restart();
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
				
				this._simulation.nodes( this._nodes ); // has to reindex every time
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
					
					this._simulation.stop();
					this._simulation.nodes( [] );
				}
				else
				{
					delete this._nodesHash[ tNodeModel._id ];
					
					this._simulation.nodes( this._nodes );
				}
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