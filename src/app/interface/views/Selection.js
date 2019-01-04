import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Transform2DModel from "../../core/Transform2D";
import Vector2D from "../../core/Vector2D";
import Matrix2D from "../../core/Matrix2D";
import SelectionModel from "../Selection";
import "./Selection.css";

class Selection extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			isDragging: false
		};
		
		// Variables
		this._element = null;
		this._graph = null;
		this._viewOffset = new Vector2D();
		
		// Events
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onGraphMove = ( tEvent ) => { this.onGraphMove( tEvent ); };
		this._onGraphStop = ( tEvent ) => { this.onGraphStop( tEvent ); };
	}
	
	componentWillUnmount()
	{
		
	}
	
	onSelectGraph( tEvent, tGraph )
	{
		if ( tEvent == null )
		{
			this._graph = null;
			
			// Remove events
		}
		else
		{
			if ( this.props.model.isPanning )
			{
				this._viewOffset = Matrix2D.MultiplyPoint( this.props.viewTransform.localToWorldMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this.props.viewTransform.worldPosition );
				this._graph = tGraph;
				this._graph.setState( { isSelected: true } );
				
				this._element.addEventListener( "mousemove", this._onGraphMove );
				this._element.addEventListener( "mouseup", this._onGraphStop );
				this._element.addEventListener( "mouseout", this._onGraphStop );
				this.setState( { isDragging: true } );
				
				
				// Stop node dragging event
				// Drag view
			}
			else
			{
				// Clear selected nodes
				// Start marquee
			}
		}
	}
	
	onGraphMove( tEvent )
	{
		this.props.viewTransform.worldPosition = Matrix2D.MultiplyPoint( this.props.viewTransform.localToWorldMatrix, tEvent ).subtract( this._viewOffset );
	}
	
	onGraphStop( tEvent )
	{
		this._graph.setState( { isSelected: false } );
		this._graph = null;
		
		this._element.removeEventListener( "mousemove", this._onGraphMove );
		this._element.removeEventListener( "mouseup", this._onGraphStop );
		this._element.removeEventListener( "mouseout", this._onGraphStop );
		this.setState( { isDragging: false } );
	}
	
	onSelectNode( tEvent, tNode )
	{
		if ( tEvent == null )
		{
			// Remove node
		}
		else
		{
			// Add node
		}
	}
	
	onSelectEdge( tEvent, tEdge ) // TODO: do
	{
	}
	
	render()
	{
		return (
			<div className={ this.state.isDragging ? "selection dragging" : "selection" } ref={ this._onElement }/>
		);
	}
}

Selection.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};

export default observer( Selection );