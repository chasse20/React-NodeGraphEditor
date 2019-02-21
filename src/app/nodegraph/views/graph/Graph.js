import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import Bounds from "../../../core/Bounds";
import Vector2D from "../../../core/Vector2D";
import GraphModel from "../../models/Graph";
import Nodes from "./nodes/Nodes";
import Edges from "./edges/Edges";
import Grid from "./Grid";
import Arrows from "./edges/Arrows";
import Style from "./Graph.module.css";

class Graph extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._edges = null;
		this._viewElement = null;
		this._containerElement = null;
		this._marqueeElement = null;
		this._isPanHeld = false;
		this._panOffset = null;
		this._marqueeOffset = null;
		
		// Events
		this._onZoomDispose = observe( this.props.model, "zoom", ( tChange ) => { this.zoom = tChange.newValue; } );
		this._onPositionDispose = observe( this.props.model, "position", ( tChange ) => { this.position = tChange.newValue; } );
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
	}

	componentDidMount()
	{
		this.position = this.props.model.position;
		this.zoom = this.props.model.zoom;
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
		// Enable pan, remove link
		const tempModel = this.props.model;
		this._isPanHeld = tEvent.button === 1; // middle mouse pans!		
		if ( this._isPanHeld || tempModel.isPanMode )
		{
			tempModel.isPanning = true;
			this._panOffset = Vector2D.Subtract( tempModel.position, new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempModel.zoom ) ); // originally used a transform/matrix class, but this is more efficient

			document.addEventListener( "mousemove", this._onPanMove );
			document.addEventListener( "mouseup", this._onPanUp );
		}
		// Enable marquee
		else
		{
			tempModel.isMarqueeing = true;
			tempModel.clearSelectedNodes();
			tempModel.clearSelectedEdges();
			this._marqueeOffset = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempModel.zoom ).subtract( tempModel.position );
			
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
		this.props.model.position = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.model.zoom ).add( this._panOffset );
	}
	
	onMarqueeUp( tEvent )
	{
		if ( !this._isPanHeld )
		{
			this.props.model.isMarqueeing = false;
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
		const tempModel = this.props.model;
		const tempScreenEnd = new Vector2D( tEvent.clientX, tEvent.clientY );
		const tempBounds = Bounds.FromCorners( this._marqueeOffset, Vector2D.Scale( tempScreenEnd, 1 / tempModel.zoom ).subtract( tempModel.position ) );
		
		for ( let tempID in tempModel._nodes )
		{
			let tempNode = tempModel._nodes[ tempID ];
			if ( tempBounds.contains( tempNode.position ) )
			{
				if ( !tempNode._isSelected )
				{
					tempModel.addSelectedNode( tempNode );
				}
			}
			else if ( tempNode._isSelected )
			{
				tempModel.removeSelectedNode( tempNode );
			}
		}
		
		// Render
		const tempScreenStart = Vector2D.Scale( Vector2D.Add( this._marqueeOffset, tempModel.position ), tempModel.zoom );
		
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
	
	tryZoom( tEvent, tVelocity )
	{
		// Calculate
		const tempModel = this.props.model;
		var tempAmount = tempModel.zoom + ( tVelocity * tempModel.zoomSpeed );
		if ( tVelocity < 0 )
		{
			if ( tempAmount < tempModel.minZoom )
			{
				tempAmount = tempModel.minZoom;
			}
		}
		else if ( tempAmount > tempModel.maxZoom )
		{
			tempAmount = tempModel.maxZoom;
		}

		// Apply zoom and offset
		if ( tempAmount !== tempModel.zoom )
		{
			const tempWorldOffsetStart = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempModel.zoom );
			const tempWorldOffsetEnd = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempAmount );
			
			tempModel.position = tempWorldOffsetEnd.subtract( tempWorldOffsetStart ).add( tempModel.position );
			tempModel.zoom = tempAmount;
			
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
	
	render( tStyle = Style )
	{
		// Class
		const tempModel = this.props.model;
		var tempClass = `${ tStyle.graph }`;
		if ( tempModel.isPanning )
		{
			tempClass += ` ${ tStyle.panning }`;
		}
		
		if ( tempModel.isMarqueeing )
		{
			tempClass += ` ${ tStyle.marqueeing }`;
		}
		
		// Render
		return (
			<svg className={ tempClass } onWheel={ this._onMouseWheel } onMouseDown={ this._onMouseDown }>
				<Arrows graph={ tempModel }/>
				<Grid graph={ tempModel }/>
				<g ref={ this._onViewElement }>
					<g ref={ this._onContainerElement }>
						<Edges ref={ this._onEdges } graph={ tempModel }/>
						<Nodes graph={ tempModel } onLink={ this._onLink }/>
					</g>
				</g>
				<rect ref={ this._onMarqueeElement } className={ tStyle.marquee }/>
			</svg>
		);
	}
}

Graph.propTypes =
{
	model: PropTypes.instanceOf( GraphModel ).isRequired,
};

export default observer( Graph );