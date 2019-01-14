import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import Vector2D from "../../../core/Vector2D";
import GraphModel from "../../Graph";
import Physics from "./physics/Physics";
import Nodes from "./nodes/Nodes";
import Edges from "./edges/Edges";
import Grid from "./grid/Grid";
import Arrows from "./arrows/Arrows";
import "./Graph.css";

class Graph extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._physics = null;
		this._nodes = null;
		this._edges = null;
		this._viewElement = null;
		this._containerElement = null;
		this._marqueeElement = null;
		this._isPanHeld = false;
		this._panOffset = null;
		this._marqueeOffset = null;
		
		// Events
		this._onZoomDispose = observe( this.props.model, "_zoom", ( tChange ) => { this.zoom = tChange.newValue; } );
		this._onPositionDispose = observe( this.props.model, "_position", ( tChange ) => { this.position = tChange.newValue; } );
		this._onPhysics = ( tComponent ) => { this._physics = tComponent; };
		this._onNodes = ( tComponent ) => { this._nodes = tComponent; };
		this._onEdges = ( tComponent ) => { this._edges = tComponent; };
		this._onViewElement = ( tElement ) => { this._viewElement = tElement; };
		this._onContainerElement = ( tElement ) => { this._containerElement = tElement; };
		this._onMarqueeElement = ( tElement ) => { this._marqueeElement = tElement; };
		this._onLink = ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); };
		this._onMouseWheel = ( tEvent ) => { this.tryZoom( tEvent, tEvent.deltaY > 0 ? -1 : 1 ); }; // only Mozilla respects mouse wheel delta
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
		this._onPanMove = ( tEvent ) => { this.onPanMove( tEvent ); };
		this._onPanUp = ( tEvent ) => { this.onPanUp( tEvent ); };
		this._onMarqueeMove = ( tEvent ) => { this.onMarqueeMove( tEvent ); };
		this._onMarqueeUp = ( tEvent ) => { this.onMarqueeUp( tEvent ); };
		this._onNodePhysics = ( tNode, tIsAdded ) => { this._physics.onNodePhysics( tNode, tIsAdded ); };
		this._onEdgePhysics = ( tEdge, tIsAdded ) => { this._physics.onEdgePhysics( tEdge, tIsAdded ); };
	}

	componentDidMount()
	{
		this.position = this.props.model._position;
		this.zoom = this.props.model._zoom;
	}
	
	componentWillUnmount()
	{
		// Remove events
		this._onZoomDispose();
		this._onZoomDispose = null;
		this._onPositionDispose();
		this._onPositionDispose = null;
		
		document.removeEventListener( "mousemove", this._onPanMove );
		document.removeEventListener( "mouseup", this._onPanUp );
		document.removeEventListener( "mousemove", this._onMarqueeMove );
		document.removeEventListener( "mouseup", this._onMarqueeUp );
	}
	
	onMouseDown( tEvent )
	{
		// Enable pan
		this._isPanHeld = tEvent.button === 1; // middle mouse pans!		
		if ( this._isPanHeld || this.props.model.isPanMode )
		{
			this.props.model.isPanning = true;
			this._panOffset = Vector2D.Subtract( this.props.model._position, new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.model._zoom ) ); // originally used a transform/matrix class, but this is more efficient

			document.addEventListener( "mousemove", this._onPanMove );
			document.addEventListener( "mouseup", this._onPanUp );
		}
		// Enable marquee
		else
		{
			this.props.model.isMarquee = true;
			this._marqueeOffset = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.model._zoom ).subtract( this.props.model._position );
			
			document.addEventListener( "mousemove", this._onMarqueeMove );
			document.addEventListener( "mouseup", this._onMarqueeUp );
		}
	}
	
	onPanUp( tEvent )
	{
		this.props.model.isPanning = false;
		this._isPanHeld = false;
		this._panOffset = null;
		
		document.removeEventListener( "mousemove", this._onPanMove );
		document.removeEventListener( "mouseup", this._onPanUp );
	}
	
	onPanMove( tEvent )
	{
		this.props.model._position = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.model._zoom ).add( this._panOffset );
	}
	
	onMarqueeUp( tEvent )
	{
		if ( !this._isPanHeld )
		{
			this.props.model.isMarquee = false;
			this._marqueeOffset = null;
			
			this._marqueeElement.setAttribute( "x", 0 );
			this._marqueeElement.setAttribute( "y", 0);
			this._marqueeElement.setAttribute( "width", 0 );
			this._marqueeElement.setAttribute( "height", 0 );
			
			document.removeEventListener( "mousemove", this._onMarqueeMove );
			document.removeEventListener( "mouseup", this._onMarqueeUp );
		}
	}
	
	onMarqueeMove( tEvent )
	{
		// Select
		const tempScreenEnd = new Vector2D( tEvent.clientX, tEvent.clientY );
		const tempLocalEnd = Vector2D.Scale( tempScreenEnd, 1 / this.props.model._zoom ).subtract( this.props.model._position );
		
		this._nodes.onMarqueeMove( this._marqueeOffset, tempLocalEnd );
		
		// Render
		const tempScreenStart = Vector2D.Scale( Vector2D.Add( this._marqueeOffset, this.props.model._position ), this.props.model._zoom );
		
		if ( tempScreenEnd.x < tempScreenStart.x )
		{
			this._marqueeElement.setAttribute( "x", tempScreenEnd.x );
			this._marqueeElement.setAttribute( "width", tempScreenStart.x - tempScreenEnd.x );
		}
		else
		{
			this._marqueeElement.setAttribute( "x", tempScreenStart.x );
			this._marqueeElement.setAttribute( "width", tempScreenEnd.x - tempScreenStart.x );
		}
		
		if ( tempScreenEnd.y < tempScreenStart.y )
		{
			this._marqueeElement.setAttribute( "y", tempScreenEnd.y );
			this._marqueeElement.setAttribute( "height", tempScreenStart.y - tempScreenEnd.y );
		}
		else
		{
			this._marqueeElement.setAttribute( "y", tempScreenStart.y );
			this._marqueeElement.setAttribute( "height", tempScreenEnd.y - tempScreenStart.y );
		}
	}
	
	tryZoom( tMouse, tVelocity ) // TODO: offset zooming from mouse position
	{
		// Calculate
		const tempModel = this.props.model;
		var tempAmount = tempModel._zoom + ( tVelocity * this.props.zoomSpeed );
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
		if ( tempAmount !== tempModel._zoom )
		{
			tempModel._zoom = tempAmount;
			return true;
		}
		
		return false;
	}
	
	set zoom( tAmount )
	{
		this._viewElement.setAttribute( "transform", "scale(" + tAmount + ")" );
	}
	
	set position( tPosition )
	{
		this._containerElement.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	render()
	{
		return (
			<React.Fragment>
				<Physics ref={ this._onPhysics } graph={ this.props.model }/>
				<svg className={ ( this.props.model.isPanning ? "graph panning" : "graph" ) + ( this.props.model.isMarquee ? " marqueeing" : "" ) } onWheel={ this._onMouseWheel } onMouseDown={ this._onMouseDown }>
					<Arrows types={ this.props.model._edgeTypes }/>
					<Grid graph={ this.props.model }/>
					<g ref={ this._onViewElement }>
						<g ref={ this._onContainerElement }>
							<Edges ref={ this._onEdges } onPhysics={ this._onEdgePhysics }/>
							<Nodes ref={ this._onNodes } graph={ this.props.model } onLink={ this._onLink } onPhysics={ this._onNodePhysics }/>
						</g>
					</g>
					<rect ref={ this._onMarqueeElement } className={ this.props.model.isMarquee ? "marquee active" : "marquee" }/>
				</svg>
			</React.Fragment>
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