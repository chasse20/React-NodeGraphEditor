import React from "react";
import PropTypes from "prop-types";
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
		this._simulation.force( "charge", this.createChargeForce() );
		this._simulation.force( "collide", this.createCollideForce() );
		this._simulation.force( "link", this.createLinkForce() );
		this._simulation.force( "center", this.createCenterForce() );
		this._simulation.on( "tick", () => { this.onTick(); } );
		
		// Initialize
		this.handleEnabled();
		this.restart();
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
			this._simulation.alpha( 1 ).alphaTarget( 0 ).restart();
		}
	}
	
	createChargeForce()
	{
		return forceManyBody().strength( -100 ).distanceMax( 500 );
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
				var tempWeight = 500; // min
				if ( tLink._model.weight < 5 )
				{
					tempWeight += ( ( 1000 - tempWeight ) * tLink._model.weight ) * -0.2; // 5 is max weight which forces min... weight of 0 is 500
				}
				
				return tempWeight;
			}
		).strength( 1 );
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
				this.onSetNode( tempNodes[i], i === 0 );
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
								this.onSetEdge( tempLinks[k], k === 0 );
							}
						}
					}
				}
			}
			
			this.restart();
		}
		else
		{
			this.clearBodies();
		}
	}
	
	onSetNode( tNodeModel, tIsApplied = true )
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
				
				if ( tIsApplied )
				{
					this._simulation.nodes( this._nodes );
				}
			}
		}
	}
	
	onSetEdge( tEdgeModel, tIsApplied = true )
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
				
				if ( tIsApplied )
				{
					this._simulation.force( "link" ).links( this._edges );
				}
			}
		}
	}
	
	/*setNode( tNodeModel, tRestart = true )
	{
		if ( this._isEnabled && tNodeModel != null )
		{
			if ( this._nodesHash == null )
			{
				this._nodes = [];
				this._nodesHash = {};
			}
			
			if ( this._nodesHash[ tNodeModel._id ] == null )
			{
				// Nodes
				const tempPhysics = new BodyNode( tNodeModel );
				this._nodesHash[ tNodeModel._id ] = tempPhysics;
				this._nodes.push( tempPhysics );
				
				this._simulation.nodes( this._nodes );
				
				// Edges
				for ( let tempName in tNodeModel._pins )
				{
					let tempPin = tNodeModel._pins[ tempName ];
					if ( tempPin._isOut )
					{
						for ( let tempKey in tempPin._links )
						{
							this.setEdge( tempPin._links[ tempKey ] );
						}
					}
				}
				
				if ( tRestart )
				{
					this._simulation.alphaTarget( 0 ).restart();
				}
				
				return true;
			}
		}
		
		return false;
	}
	
	removeNode( tNodeModel )
	{
		if ( tNodeModel != null && this._nodesHash !== null )
		{
			const tempPhysics = this._nodesHash[ tNodeModel._id ];
			if ( tempPhysics != null )
			{
				this._nodes.splice( tempPhysics.index, 1 );
				if ( this._nodes.length === 0 )
				{
					this._nodes = null;
					this._nodesHash = null;
					this._edges = null;
					this._edgesHash = null;
					
					this._simulation.stop();
				}
				else
				{
					// Edges
					for ( let tempName in tNodeModel._pins )
					{
						let tempPin = tNodeModel._pins[ tempName ];
						if ( tempPin._isOut )
						{
							for ( let tempKey in tempPin._links )
							{
								this.removeEdge( tempPin._links[ tempKey ] );
							}
						}
					}
					
					// Nodes
					delete this._nodesHash[ tNodeModel._id ];
					this._simulation.nodes( this._nodes );
					
					this._simulation.alphaTarget( 0 ).restart();
				}
				
				return true;
			}
		}
		
		return false;
	}
	
	setEdge( tEdgeModel )
	{
		console.log( tEdgeModel );
		if ( this._isEnabled && tEdgeModel != null )
		{
			if ( this._edgesHash == null )
			{
				this._edges = [];
				this._edgesHash = {};
			}
			
			const tempID = tEdgeModel.id;
			if ( this._edgesHash[ tempID ] == null )
			{
				const tempPhysics = new BodyEdge( tEdgeModel );
				this._edgesHash[ tempID ] = tempPhysics;
				this._edges.push( tempPhysics );
				console.log( this._simulation.nodes() );
				
				this._simulation.force( "link" ).links( this._edges );
				
				return true;
			}
		}
		
		return false;
	}
	
	removeEdge( tEdgeModel )
	{
		if ( tEdgeModel != null && this._nodesHash !== null )
		{
			const tempID = tEdgeModel.id;
			const tempPhysics = this._edgesHash[ tempID ];
			if ( tempPhysics != null )
			{
				this._edges.splice( tempPhysics.index, 1 );
				if ( this._edges.length === 0 )
				{
					this._edges = null;
					this._edgesHash = null;
					
					this._simulation.force( "link" ).links( null );
				}
				else
				{
					delete this._edgesHash[ tempID ];
					
					this._simulation.force( "link" ).links( this._edges );
				}
				
				return true;
			}
		}
	}
	
	getNodeBody( tNodeModel )
	{
		return tNodeModel == null || this._nodesHash == null ? null : this._nodesHash[ tNodeModel._id ];
	}
	
	onSelectNode( tNodeModel )
	{
		if ( tNodeModel != null && this._nodesHash !== null )
		{
			const tempPhysics = this._nodesHash[ tNodeModel._id ];
			if ( tempPhysics != null )
			{
				tempPhysics.fx = tempPhysics.x;
				tempPhysics.fy = tempPhysics.y;
			}
		}
	}
	
	onDeselectNode( tNodeModel )
	{
		if ( tNodeModel != null && this._nodesHash !== null )
		{
			const tempPhysics = this._nodesHash[ tNodeModel._id ];
			if ( tempPhysics != null )
			{
				tempPhysics.fx = null;;
				tempPhysics.fy = null;
			}
		}
	}
	
	restart()
	{
		if ( this._isEnabled )
		{
			this._simulation.alphaTarget( 0.3 );
		}
	}*/
}

decorate( Physics,
	{
		_isEnabled: observable
	}
);