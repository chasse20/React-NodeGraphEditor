import React from "react";
import PropTypes from "prop-types";
import Transform2DModel from "../../core/Transform2D";
import Vector2D from "../../core/Vector2D";
import Matrix2D from "../../core/Matrix2D";
import SelectionModel from "../Selection";

export default class SelectionPan extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._graph = null;
		this._mouseStart = null;
		this._offset = null;
		
		// Events
		this._onMouseMove = ( tEvent ) => { this.onMouseMove( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}
	
	componentWillUnmount()
	{
		this.onMouseUp();
	}
	
	onSelect( tEvent, tGraph )
	{
		if ( tEvent == null )
		{
			this.onMouseUp();
		}
		else if ( this.props.model.isPanMode || this.props.model.isPanningHeld )
		{
			this._mouseStart = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.viewTransform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) );
			
			this._graph = tGraph;
			this._graph.isSelected = true;
			this._offset = this._graph._transform._position;
			
			document.addEventListener( "mousemove", this._onMouseMove );
			document.addEventListener( "mouseup", this._onMouseUp );
		}
	}
	
	onMouseMove( tEvent )
	{
		this._graph._transform.position = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.viewTransform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._mouseStart ).add( this._offset );
	}
	
	onMouseUp( tEvent )
	{
		this._offset = null;
		this._mouseStart = null;
		
		this._graph.isSelected = false;
		this._graph = null;
		this.props.model.isPanningHeld = false;
		
		document.removeEventListener( "mousemove", this._onMouseMove );
		document.removeEventListener( "mouseup", this._onMouseUp );
	}
	
	render()
	{
		return null;
	}
}

SelectionPan.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};