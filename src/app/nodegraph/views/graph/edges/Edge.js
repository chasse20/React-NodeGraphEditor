import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import Vector2D from "../../../../core/Vector2D";
import EdgeModel from "../../../models/Edge";
import EdgeBase from "../../../../nodegraph-base/views/graph/edges/Edge";
import Style from "./Edge.module.css";

class Edge extends EdgeBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._textElement = null;
		this._selectionElement = null;
		//this._physicsBody = this.createPhysics();

		// Events
		this._onTextElement = ( tElement ) => { this._textElement = tElement; };
		this._onTargetRadius = observe( tProps.model._target._node._type, "radius", ( tChange ) => { this.targetPosition = this.props.model._target.position; } );
		this._onSelectionElement = ( tElement ) => { this._selectionElement = tElement; };
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
	}
	
	componentDidMount()
	{
		super.componentDidMount();
		
		//this.props.onPhysics( this._physicsBody, true );
	}
	
	componentWillUnmount()
	{
		// Inheritance
		super.componentWillUnmount();
		
		// Events
		this._onTargetRadius();
		this._onTargetRadius = null;
		//this.props.onPhysics( this._physicsBody, false );
	}
	
	createPhysics()
	{
		const tempModel = this.props.model;
		
		return {
			source: tempModel._source._node._id,
			target: tempModel._target._node._id
		};
	}
	
	onMouseDown( tEvent )
	{
		// Select
		if ( tEvent.button !== 1 ) // middle-mouse is reserved
		{
			const tempModel = this.props.model;
			if ( tempModel._isSelected )
			{
				tempModel._source._node._graph.removeSelectedEdge( tempModel );
			}
			else
			{
				tempModel._source._node._graph.addSelectedEdge( tempModel );
			}
		}
	}
	
	set sourcePosition( tVector )
	{
		// Inheritance
		super.sourcePosition = tVector;
		
		// Selection
		this._selectionElement.setAttribute( "x1", tVector.x );
		this._selectionElement.setAttribute( "y1", tVector.y );
		
		// Position
		this.updatePosition( tVector, this.props.model._target.position ); // TODO: prevent from calling twice
	}
	
	set targetPosition( tVector )
	{
		// Selection
		this._selectionElement.setAttribute( "x2", tVector.x );
		this._selectionElement.setAttribute( "y2", tVector.y );
		
		// Position
		this.updatePosition( this.props.model._source.position, tVector );
	}
	
	updatePosition( tStart, tEnd )
	{
		// Text positioned at midpoint
		const tempSegment = Vector2D.Subtract( tEnd, tStart );
		if ( this._textElement !== null )
		{
			this._textElement.setAttribute( "x", ( tStart.x + ( tempSegment.x * 0.5 ) ) );
			this._textElement.setAttribute( "y", ( tStart.y + ( tempSegment.y * 0.5 ) ) );
		}
		
		// End positioned from radius (if exists)
		const tempRadius = this.props.model._target._node._type.radius;
		if ( tempRadius > 0 )
		{
			var tempScale = tempSegment.length;
			if ( tempScale > 0 )
			{
				tempSegment.scale( ( tempScale - tempRadius ) / tempScale ).add( tStart );
				this._element.setAttribute( "x2", tempSegment.x );
				this._element.setAttribute( "y2", tempSegment.y );
				this._selectionElement.setAttribute( "x2", tempSegment.x );
				this._selectionElement.setAttribute( "y2", tempSegment.y );
				
				return;
			}
		}
	}
	
	render( tStyle = Style )
	{
		// Variables
		const tempModel = this.props.model;
		const tempType = tempModel._type;
		const tempText = tempType.text;
		const tempStroke = tempType.stroke;
		
		// Class
		var tempClass = `${ tStyle.edge }`;
		if ( tempModel._isSelected )
		{
			tempClass += ` ${ tStyle.selected }`;
		}
		
		if ( tempType.isVisible && tempModel._source._node._type.isVisible && tempModel._target._node._type.isVisible )
		{
			tempClass += ` ${ tStyle.visible }`;
		}
		
		// Render
		return (
			<g className={ tempClass }>
				<line className={ tStyle.selection } ref={ this._onSelectionElement } onMouseDown={ this._onMouseDown }/>
				<line className={ tStyle.line } ref={ this._onElement } stroke={ tempStroke } markerEnd={ "url(#arrow-" + tempType._name + ")" }/>
				{
					tempText != null &&
						<text ref={ this._onTextElement } alignmentBaseline="middle" textAnchor="middle" fill={ tempStroke }>
							{ tempText }
						</text>
				}
			</g>
		);
	}
}

Edge.propTypes = Object.assign(
	{},
	EdgeBase.propTypes,
	{
		model: PropTypes.instanceOf( EdgeModel ).isRequired
	}
);

export default observer( Edge );