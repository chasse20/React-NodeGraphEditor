import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import EdgeModel from "../Edge";
import Node from "./Node";
import Vector2D from "../../core/Vector2D";
import Utility from "../Utility";
import "./Edge.css";

class Edge extends React.Component
{
	static SerializableClasses = { "Edge": Edge };
	
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state =
		{
			isSelected: false
		};
		
		// Variables
		this._element = null;
		this._textElement = null;
		this._sourcePosition = new Vector2D();
		this._targetPosition = new Vector2D();
		
		// Events
		const tempOnSourceMove = ( tChange ) => { this.onSourceMove(); };
		this._onOffsetMove = observe( tProps.model._source, this.onSourceChange );
		this._onSourceMove = observe( tProps.model._source._node._transform, tempOnSourceMove );
		this._onTargetMove = observe( tProps.model._target._node._transform, ( tChange ) => { this.onTargetMove(); } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onTextElement = ( tElement ) => { this._textElement = tElement; };
	}

	componentDidMount()
	{
		this.sourcePosition = this.props.model._source.worldPosition;
		this.targetPosition = this.props.model._target.worldPosition;
	}
	
	componentWillUnmount()
	{
		if ( this.state.isSelected )
		{
			this.props.onSelect( null, this );
		}
		
		this._onOffsetMove();
		this._onOffsetMove = null;
		this._onSourceMove();
		this._onSourceMove = null;
		this._onTargetMove();
		this._onTargetMove = null;
	}
	
	onSourceChange( tChange )
	{
		if ( tChange.name === "_offset" )
		{
			this.onSourceMove();
		}
	}
	
	onSourceMove()
	{
		this.sourcePosition = this.props.model._source.worldPosition;
	}
	
	onTargetMove()
	{
		this.targetPosition = this.props.model._target.worldPosition;
	}
	
	set sourcePosition( tVector )
	{
		this._sourcePosition = tVector;
		
		this._element.setAttribute( "x1", this._sourcePosition.x );
		this._element.setAttribute( "y1", this._sourcePosition.y );

		this.updatePosition();
	}
	
	set targetPosition( tVector )
	{
		this._targetPosition = tVector;		
		this.updatePosition(); // TODO: Cut this out if target AND source are moving at same time in selection
	}
	
	updatePosition()
	{
		// Text positioned at midpoint
		const tempSegment = Vector2D.Subtract( this._targetPosition, this._sourcePosition );
		
		if ( this._textElement !== null )
		{
			this._textElement.setAttribute( "x", ( this._sourcePosition.x + ( tempSegment.x * 0.5 ) ) );
			this._textElement.setAttribute( "y", ( this._sourcePosition.y + ( tempSegment.y * 0.5 ) ) );
		}
		
		// End positioned from radius (if exists)
		const tempTargetNode = this.props.model._target._node;
		const tempRadius = Utility.DefaultData( "radius", tempTargetNode.data, tempTargetNode._type.data, Node.defaultProps.radius );
		if ( tempRadius > 0 )
		{
			var tempScale = tempSegment.length;
			if ( tempScale > 0 )
			{
				tempScale = ( tempScale - tempRadius ) / tempScale;
				this._element.setAttribute( "x2", ( this._sourcePosition.x + ( tempSegment.x * tempScale ) ) );
				this._element.setAttribute( "y2", ( this._sourcePosition.y + ( tempSegment.y * tempScale ) ) );
				
				return;
			}
		}
		
		this._element.setAttribute( "x2", this._targetPosition.x );
		this._element.setAttribute( "y2", this._targetPosition.y );
	}

	render()
	{
		const tempModel = this.props.model;
		const tempType = tempModel._type;
		const tempTypeData = tempType.data;
		const tempText = Utility.DefaultData( "text", tempModel, tempTypeData, this.props.text );
		const tempStroke = Utility.DefaultData( "stroke", tempModel, tempTypeData, this.props.stroke );

		// Render
		return (
			<g className={ "edge " + this.constructor.name }>
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
	model: PropTypes.instanceOf( EdgeModel ).isRequired,
	onSelect: PropTypes.func.isRequired,
	text: PropTypes.string,
	stroke: PropTypes.string
};

Edge.defaultProps =
{
	text: null,
	stroke: "#42d3ff"
};

export default observer( Edge );