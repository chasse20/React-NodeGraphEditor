import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Vector2D from "../../../../core/Vector2D";
import EdgeBase from "../../../../nodegraph/views/graph/edge/Edge";
import "./Edge.css";

class Edge extends EdgeBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._textElement = null;
		this._physicsBody = this.createPhysics();

		// Events
		this._onTextElement = ( tElement ) => { this._textElement = tElement; };
	}
	
	componentDidMount()
	{
		super.componentDidMount();
		
		this.props.onPhysics( this._physicsBody, true );
	}
	
	componentWillUnmount()
	{
		super.componentWillUnmount();
		
		this.props.onPhysics( this._physicsBody, false );
	}
	
	createPhysics()
	{
		const tempModel = this.props.model;
		
		return {
			source: tempModel._source._node._id,
			target: tempModel._target._node._id
		};
	}
	
	set sourcePosition( tVector )
	{
		super.sourcePosition = tVector;
		
		this.updatePosition( tVector, this.props.model._target.position ); // TODO: prevent from calling twice
	}
	
	set targetPosition( tVector )
	{
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
				
				return;
			}
		}
	}
	
	render()
	{
		const tempType = this.props.model._type;
		const tempText = tempType.text;
		const tempStroke = tempType.stroke;
		
		return (
			<g className={ "edge " + this.constructor.name + ( this.props.model.isSelected ? " selected" : "" ) }>
				<line ref={ this._onElement } stroke={ tempStroke } strokeOpacity="0.6" markerEnd={ "url(#arrow-" + tempType._name + ")" }/>
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

Edge.propTypes =
{
	onPhysics: PropTypes.func.isRequired
};

export default observer( Edge );