import React from "react";
import PropTypes from "prop-types";
import { decorate, observable } from "mobx";
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from "d3";
import Vector2D from "../../core/Vector2D";
import BodyNode from "./BodyNode";
import BodyEdge from "./BodyEdge";

export default class Physics
{
	constructor( tGraph )
	{
		// Variables
		this._graph = tGraph;
		this._isEnabled = false;
		this._nodes = null; // physics objects
		this._nodesHash = null;
		this._edges = null; // physics objects
		this._edgesHash = null;
		
		this._simulation = forceSimulation();
		this._simulation.force( "charge", forceManyBody() );
		this._simulation.force( "link", this.createLinkForce() );
		this._simulation.force( "x", forceX() );
		this._simulation.force( "y", forceY() );
		this._simulation.on( "tick", () => { this.onTick(); } );
		this._simulation.stop();
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
				var tempWeight = 250; // min
				if ( tLink.model.weight < 5 )
				{
					tempWeight += ( ( 500 - tempWeight ) * tLink.model.weight ) * -0.2; // 5 is max weight which forces min... weight of 0 is 500
				}
				
				return tempWeight;
			}
		).strength( 1 );
	}
	
	setNode( tNodeModel, tRestart = true )
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
	}	
	
	set isEnabled( tIsEnabled )
	{
		if ( this._isEnabled != tIsEnabled )
		{
			this._isEnabled = tIsEnabled;
			if ( this._isEnabled )
			{
				for ( let tempID in this._graph._nodes )
				{
					this.setNode( this._graph._nodes[ tempID ] );
				}
				
				this.restart();
			}
			else
			{
				this._nodes = null;
				this._nodesHash = null;
				this._simulation.stop();
			}
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
}

decorate( Physics,
	{
		_isEnabled: observable
	}
);