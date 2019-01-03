import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import Vector2D from "../../core/Vector2D";
import Transform2DModel from "../../core/Transform2D";
import ZoomModel from "../Zoom";
import "./ZoomControls.css";

class ZoomControls extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._meterElement = null;
		
		// Events
		this._onTransformDispose = observe( tProps.viewTransform, ( tChange ) => { this.onTransform( tChange ); } );
		this._onMeterElement = ( tElement ) => { this._meterElement = tElement; };
		this._onMouseWheel = ( tEvent ) => { this.tryZoom( tEvent, tEvent.deltaY > 0 ? -100 : 100 ); }; // only Mozilla respects mouse wheel delta
		this._onZoomIn = ( tEvent ) => { this.tryZoom( tEvent, 200 ); };
		this._onZoomOut = ( tEvent ) => { this.tryZoom( tEvent, -200 ); };
	}
	
	componentDidMount()
	{		
		document.addEventListener( "wheel", this._onMouseWheel );
		this.zoom = this.props.viewTransform._scale.x;
	}
	
	componentWillUnmount()
	{
		document.removeEventListener( "wheel", this._onMouseWheel );
	}
	
	onTransform( tChange )
	{
		if ( tChange.name === "_scale" )
		{
			this.zoom = tChange.newValue.x;
		}
	}
	
	set zoom( tAmount )
	{
		const tempSlope = -70 / ( this.props.model.max - this.props.model.min );
		this._meterElement.style.transform = "translateY(" + ( ( tempSlope * tAmount ) - ( tempSlope * this.props.model.max ) ) + "px)";
	}
	
	tryZoom( tMouse, tVelocity ) // TODO: offset zooming from mouse position
	{
		// Calculate
		var tempAmount = this.props.viewTransform._scale.x + ( tVelocity * this.props.model.speed );
		if ( tVelocity < 0 )
		{
			if ( tempAmount < this.props.model.min )
			{
				tempAmount = this.props.model.min;
			}
		}
		else if ( tempAmount > this.props.model.max )
		{
			tempAmount = this.props.model.max;
		}

		// Apply
		if ( tempAmount !== this.props.viewTransform._scale.x )
		{
			this.props.viewTransform._scale = new Vector2D( tempAmount, tempAmount );
			return true;
		}
		
		return false;
	}
	
	render() // TODO: smooth zoom buttons
	{
		const tempScale = Math.round( this.props.viewTransform._scale.x * 1000 ) / 1000;
		
		return (
			<div className="zoom-controls">
				<button className={ tempScale >= this.props.model.max ? null : "selected" } onClick={ this._onZoomIn }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="-467 269 24 24">
						<path d="M-451.5,283h-0.8l-0.3-0.3c1-1.1,1.6-2.6,1.6-4.2c0-3.6-2.9-6.5-6.5-6.5s-6.5,2.9-6.5,6.5s2.9,6.5,6.5,6.5 c1.6,0,3.1-0.6,4.2-1.6l0.3,0.3v0.8l5,5l1.5-1.5L-451.5,283z M-457.5,283c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5 S-455,283-457.5,283z"/>
						<polygon points="-455,279 -457,279 -457,281 -458,281 -458,279 -460,279 -460,278 -458,278 -458,276 -457,276 -457,278 -455,278 "/>
					</svg>
				</button>
				<div className="zoom-track">
					<button className="zoom-meter selected" ref={ this._onMeterElement }/>
					<div className="zoom-lines">
						<div/>
						<div/>
						<div/>
					</div>
				</div>
				<button className={ tempScale <= this.props.model.min ? null : "selected" } onClick={ this._onZoomOut }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="-467 269 24 24">
						<path d="M-451.5,283h-0.8l-0.3-0.3c1-1.1,1.6-2.6,1.6-4.2c0-3.6-2.9-6.5-6.5-6.5s-6.5,2.9-6.5,6.5s2.9,6.5,6.5,6.5 c1.6,0,3.1-0.6,4.2-1.6l0.3,0.3v0.8l5,5l1.5-1.5L-451.5,283z M-457.5,283c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5 S-455,283-457.5,283z M-460,278h5v1h-5V278z"/>
					</svg>
				</button>
			</div>
		);
	}
}

ZoomControls.propTypes =
{
	model: PropTypes.instanceOf( ZoomModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};

export default observer( ZoomControls );