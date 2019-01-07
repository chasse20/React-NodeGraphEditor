import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3";
import Vector2D from "../../core/Vector2D";
import PhysicsModel from "../../interface/Physics";

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
		this._simulation.force( "link", forceLink().id( ( tLink ) => { return tLink.id; } ).distance( 500 ).strength( 0.125 ) );
		this._simulation.force( "collision", forceCollide().radius( 50 ).strength( 0.3 ) );
		this._simulation.alphaDecay( 0.0001 );
		this._simulation.velocityDecay( 0.1 );
		this._simulation.alpha( 0.1 );
		this._simulation.on( "tick", () => { this.onTick(); } );
		this._simulation.stop();
		
		// Events
		this._onPhysics = observe( tProps.model, "isEnabled", ( tChange ) => { this.isEnabled = tChange.newValue; } );
	}
	
	componentDidMount()
	{
		this.isEnabled = true;
	}

	componentWillUnmount()
	{
		this._simulation.stop();
		// dump sim
	}
	
	set isEnabled( tIsEnabled )
	{
		console.log( tIsEnabled && this._nodes !== null && this.props.model.isEnabled );
		if ( tIsEnabled && this._nodes !== null && this.props.model.isEnabled )
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
			this._nodes[i].transform.position = new Vector2D( this._nodes[i].x, this._nodes[i].y );
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
			this._simulation.stop();
			if ( this._nodes === null )
			{
				this._nodes = [];
			}	
			this._nodes.push( tNode );
			
			this._simulation.nodes( this._nodes );
			this.isEnabled = true;
			
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
				this._nodes.splice( tempIndex, 1 );
				if ( this._nodes.length === 0 )
				{
					this._nodes = null;
					this.isEnabled = false;
				}
				else
				{
					this._simulation.nodes( this._nodes );
					this.isEnabled = true;
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
			this._simulation.stop();
			if ( this._edges === null )
			{
				this._edges = [];
			}		
			this._edges.push( tEdge );
			
			this._simulation.force( "link" ).links( this._edges );
			this.isEnabled = true;
			
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
				this._simulation.stop();
				this._edges.splice( tempIndex, 1 );
				if ( this._edges.length === 0 )
				{
					this._edges = null;
				}
				
				this._simulation.force( "link" ).links( this._edges );
				this.isEnabled = true;
				
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
	model: PropTypes.instanceOf( PhysicsModel ).isRequired
};

export default observer( Physics );