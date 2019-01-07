import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Transform2DModel from "../../core/Transform2D";
import GraphModel from "../../nodegraph/Graph";
import Vector2D from "../../core/Vector2D";
import Matrix2D from "../../core/Matrix2D";
import SelectionModel from "../Selection";
import "./SelectionMarquee.css";

class SelectionMarquee extends React.Component // TODO: Break up into sub components
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._element = null;
		this._mouseStart = null;
		this._mouseEnd = null;
		this._offset = null;
		
		// Events
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onMouseMove = ( tEvent ) => { this.onMouseMove( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}
	
	componentWillUnmount()
	{
		this.onMouseUp();
	}
	
	onSelect( tEvent )
	{
		if ( tEvent == null )
		{
			this.onMouseUp();
		}
		else if ( !this.props.model.isPanMode && !this.props.model.isPanningHeld ) // marquee only if not already panning!
		{
			this.props.model.isMarqueeHeld = true;
			
			this._mouseStart = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.viewTransform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) );
			this._mouseEnd = this._mouseStart.copy();
			this._offset = this.props.graph._transform._position.copy();
			
			document.addEventListener( "mousemove", this._onMouseMove );
			document.addEventListener( "mouseup", this._onMouseUp );
		}
	}
	
	onMouseMove( tEvent )
	{
		this._mouseEnd = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.viewTransform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) );
		this.update();
	}
	
	update()
	{
		const tempStart = Matrix2D.MultiplyPoint( this.props.viewTransform.localMatrix, Vector2D.Subtract( this._mouseStart, this._offset ).add( this.props.graph._transform._position ) );
		const tempEnd = Matrix2D.MultiplyPoint( this.props.viewTransform.localMatrix, this._mouseEnd );

		if ( tempEnd.x < tempStart.x )
		{
			this._element.setAttribute( "x", tempEnd.x );
			this._element.setAttribute( "width", tempStart.x - tempEnd.x );
		}
		else
		{
			this._element.setAttribute( "x", tempStart.x );
			this._element.setAttribute( "width", tempEnd.x - tempStart.x );
		}
		
		if ( tempEnd.y < tempStart.y )
		{
			this._element.setAttribute( "y", tempEnd.y );
			this._element.setAttribute( "height", tempStart.y - tempEnd.y );
		}
		else
		{
			this._element.setAttribute( "y", tempStart.y );
			this._element.setAttribute( "height", tempEnd.y - tempStart.y );
		}
	}
	
	onMouseUp( tEvent )
	{
		if ( tEvent.button !== 1 ) // not panning with middle mouse
		{
			this.props.model.isMarqueeHeld = false;
			
			document.removeEventListener( "mousemove", this._onMouseMove );
			document.removeEventListener( "mouseup", this._onMouseUp );
		}
	}
	
	render()
	{
		return (
			<svg className={ this.props.model.isMarqueeHeld ? "marquee active" : "marquee" }>
				<rect ref={ this._onElement }/>
			</svg>
		);
	}
}

SelectionMarquee.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( SelectionMarquee );