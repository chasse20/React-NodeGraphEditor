import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import { forceSimulation, forceLink, forceCollide, forceManyBody } from "d3";
import Vector2D from "../../../../core/Vector2D";
import GraphModel from "../../../Graph";

class Physics extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._nodes = null;
		this._edges = null;
		this._simulation = forceSimulation();
		this._simulation.force( "charge", forceManyBody().strength( -750 ).distanceMax( 300 ) );
		this._simulation.force( "link", forceLink().id( ( tLink ) => { return tLink.id; } ).distance( 500 ).strength( 0.1 ) );
		this._simulation.alphaDecay( 0 );
		this._simulation.velocityDecay( 0.9 );
		this._simulation.on( "tick", () => { this.onTick(); } );
		this._simulation.stop();
		
		// Events
		this._onPhysicsDispose = observe( this.props.graph, "isPhysics", ( tChange ) => { this.isEnabled = tChange.newValue; } );
	}
	
	componentDidMount()
	{
		this.isEnabled = this.props.graph.isPhysics;
	}
	
	componentWillUnmount()
	{
		this._simulation.stop();
		
		this._onPhysicsDispose();
		this._onPhysicsDispose = null;
	}
	
	set isEnabled( tIsEnabled )
	{
		if ( tIsEnabled && this._nodes !== null )
		{
			this._simulation.restart();
		}
		else
		{
			this._simulation.stop();
		}
	}
	
	onTick()
	{
		for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
		{
			let tempNode = this._nodes[i];
			tempNode.model.position = new Vector2D( tempNode.x, tempNode.y );
		}
	}
	
	onNodePhysics( tNode, tIsAdded )
	{
		if ( tIsAdded )
		{
			this.addNode( tNode );
		}
		else
		{
			this.removeNode( tNode );
		}
	}
	
	onEdgePhysics( tEdge, tIsAdded )
	{
		if ( tIsAdded )
		{
			this.addEdge( tEdge );
		}
		else
		{
			this.removeEdge( tEdge );
		}
	}
	
	addNode( tNode )
	{
		if ( tNode != null )
		{
			this.isEnabled = false;
			
			if ( this._nodes === null )
			{
				this._nodes = [];
			}
			this._nodes.push( tNode );
			
			this._simulation.nodes( this._nodes );
			this.isEnabled = this.props.graph.isPhysics;
			
			return true;
		}
		
		return false;
	}
	
	removeNode( tNode )
	{
		if ( tNode != null && this._nodes !== null )
		{
			const tempIndex = this._nodes.indexOf( tNode );
			if ( tempIndex >= 0 )
			{
				this.isEnabled = false;
				
				this._nodes.splice( tempIndex, 1 );
				if ( this._nodes.length === 0 )
				{
					this._nodes = null;
				}
				else
				{
					this._simulation.nodes( this._nodes );
					this.isEnabled = this.props.graph.isPhysics;
				}
				
				return true;
			}
		}
		
		return false;
	}
	
	addEdge( tEdge )
	{
		if ( tEdge != null )
		{
			this.isEnabled = false;
			
			if ( this._edges === null )
			{
				this._edges = [];
			}		
			this._edges.push( tEdge );
			
			this._simulation.force( "link" ).links( this._edges );
			this.isEnabled = this.props.graph.isPhysics;
			
			return true;
		}
		
		return false;
	}
	
	removeEdge( tEdge )
	{
		if ( tEdge != null && this._edges !== null )
		{
			const tempIndex = this._edges.indexOf( tEdge );
			if ( tempIndex >= 0 )
			{
				this.isEnabled = false;
				
				this._edges.splice( tempIndex, 1 );
				if ( this._edges.length === 0 )
				{
					this._edges = null;
				}
				else
				{
					this._simulation.force( "link" ).links( this._edges );
				}

				this.isEnabled = this.props.graph.isPhysics;
				
				return true;
			}
		}
		
		return false;
	}
	
	render()
	{
		return null;
	}
}

Physics.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Physics );