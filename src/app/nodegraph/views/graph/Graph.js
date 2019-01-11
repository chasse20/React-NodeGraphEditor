import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import Matrix2D from "../../../core/Matrix2D";
import Vector2D from "../../../core/Vector2D";
import GraphModel from "../../Graph";
import Nodes from "./nodes/Nodes";
import Edges from "./edges/Edges";
import Grid from "./grid/Grid";
import Marquee from "./marquee/Marquee";
import Arrows from "./arrows/Arrows";
import "./Graph.css";

class Graph extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._viewElement = null;
		this._nodes = null;
		this._edges = null;
		this._isPanHeld = false;
		this._mouseStart = null;
		this._offset = null;
		
		// Events
		this._onTransformDispose = observe( this.props.model._transform, ( tChange ) => { this.viewTransform =  tChange.object; } );
		this._onViewElement = ( tElement ) => { this._viewElement = tElement; };
		this._onNodes = ( tComponent ) => { this._nodes = tComponent; };
		this._onEdges = ( tComponent ) => { this._edges = tComponent; };
		this._onLink = ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); };
		this._onMouseWheel = ( tEvent ) => { this.tryZoom( tEvent, tEvent.deltaY > 0 ? -1 : 1 ); }; // only Mozilla respects mouse wheel delta
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
		this._onMouseMove = ( tEvent ) => { this.onMouseMove( tEvent ); };
	}

	componentDidMount()
	{
		this.viewTransform = this.props.model._transform;
	}
	
	componentWillUnmount()
	{
		// Remove events
		this._onTransformDispose();
		this._onTransformDispose = null;
		document.removeEventListener( "mousemove", this._onMouseMove );
	}
	
	tryZoom( tMouse, tVelocity ) // TODO: offset zooming from mouse position
	{
		// Calculate
		const tempTransform = this.props.model._transform;
		var tempAmount = tempTransform._scale.x + ( tVelocity * this.props.zoomSpeed );
		if ( tVelocity < 0 )
		{
			if ( tempAmount < this.props.minZoom )
			{
				tempAmount = this.props.minZoom;
			}
		}
		else if ( tempAmount > this.props.maxZoom )
		{
			tempAmount = this.props.maxZoom;
		}

		// Apply
		if ( tempAmount !== tempTransform._scale.x )
		{
			tempTransform.scale = new Vector2D( tempAmount, tempAmount );
			return true;
		}
		
		return false;
	}
	
	onMouseDown( tEvent )
	{
		console.log( "?sadsads" );
		// Enable pan
		this._isPanHeld = tEvent.button === 1; // middle mouse pans!
		if ( this._isPanHeld || this.props.model.isPanMode )
		{
			this.props.model.isPanning = true;
			this._mouseStart = Matrix2D.MultiplyPoint( this.props.model._transform._worldToLocalMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) );
			console.log( this._mouseStart );
			
			this._offset = this.props.model._transform._position;
			
			document.addEventListener( "mousemove", this._onMouseMove );
		}
	}
	
	onMouseUp( tEvent )
	{
		// Disable pan
		if ( this._isPanHeld || this.props.model.isPanMode )
		{
			this.props.model.isPanning = false;
			this._isPanHeld = false;
			this._mouseStart = null;
			this._offset = null;
			
			document.removeEventListener( "mousemove", this._onMouseMove );
		}
	}
	
	onMouseMove( tEvent )
	{
		const tempWorldStart = Matrix2D.MultiplyPoint( this.props.model._transform.localMatrix, this._mouseStart );
		
		//this.props.model._transform.position = Matrix2D.MultiplyPoint( Matrix2D.Inverse( Matrix2D.Multiply( Matrix2D.Translate( this.props.model._transform._position ), Matrix2D.Scale( this.props.model._transform._scale ) ) ), new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._mouseStart ).add( this._offset );
		//this.props.model._transform.position = Matrix2D.MultiplyPoint( Matrix2D.Inverse( Matrix2D.Scale( this.props.model._transform._scale ) ), new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._mouseStart ).add( this._offset );
	}
	
	set viewTransform( tTransform )
	{
		console.log( "?" );
		this._viewElement.setAttribute( "transform", "translate(" + tTransform._position.x + "," + tTransform._position.y + ") scale(" + tTransform._scale.x + ")" );
	}
	
	// PAN
	// MARQUEE IN THE RENDER, CALLBACK GOES TO NODES

	render()
	{
		console.log( "REND" );
		return (
			<svg className={ this.props.model.isPanning ? "graph panning" : "graph" } onWheel={ this._onMouseWheel } onMouseDown={ this._onMouseDown } onMouseUp={ this._onMouseUp }>
				<Arrows types={ this.props.model._edgeTypes }/>
				<Grid transform={ this.props.model._transform } isVisible={ this.props.model.isVisible }/>
				<g ref={ this._onViewElement }>
					<Edges ref={ this._onEdges }/>
					<Nodes ref={ this._onNodes } nodes={ this.props.model._nodes } onLink={ this._onLink }/>
				</g>
				<Marquee ref={ this._onMarquee } transform={ this.props.model._transform } isMarquee={ this.props.model.isMarquee }/>
			</svg>
		);
	}
}

Graph.propTypes =
{
	model: PropTypes.instanceOf( GraphModel ).isRequired,
	zoomSpeed: PropTypes.number.isRequired,
	minZoom: PropTypes.number.isRequired,
	maxZoom: PropTypes.number.isRequired
};

Graph.defaultProps =
{
	zoomSpeed: 0.05,
	minZoom: 0.1,
	maxZoom: 1
};

export default observer( Graph );