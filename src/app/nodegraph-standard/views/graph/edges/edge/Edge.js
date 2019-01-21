import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import EdgeModel from "../../../../Edge";
import Vector2D from "../../../../../core/Vector2D";
import Utility from "../../../../Utility";
import "./Edge.css";

class Edge extends React.Component // TODO: Selectable
{
	static SerializableClasses = { "default": Edge, "Edge": Edge };
	
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._physicsBody = this.createPhysics();
		this._element = null;
		this._textElement = null;
		this._sourcePosition = new Vector2D();
		this._targetPosition = new Vector2D();
		
		// Events
		this._onOffsetMove = observe( tProps.model._source, "offset", ( tChange ) => { this.sourcePosition = this.props.model._source.position; } );
		this._onSourceMove = observe( tProps.model._source._node, "position", ( tChange ) => { this.sourcePosition = this.props.model._source.position; } );
		this._onTargetMove = observe( tProps.model._target._node, "position", ( tChange ) => { this.targetPosition = this.props.model._target.position; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onTextElement = ( tElement ) => { this._textElement = tElement; };
	}

	componentDidMount()
	{
		this.sourcePosition = this.props.model._source.position;
		this.targetPosition = this.props.model._target.position;
		
		this.props.onPhysics( this._physicsBody, true );
	}
	
	componentWillUnmount()
	{
		/*if ( this.props.model.isSelected )
		{
			this.props.onSelect( null, this.props.model );
		}*/
		
		this._onOffsetMove();
		this._onOffsetMove = null;
		this._onSourceMove();
		this._onSourceMove = null;
		this._onTargetMove();
		this._onTargetMove = null;
		
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
		const tempRadius = Utility.DefaultData( tempTargetNode.data.radius, tempTargetNode._type.data.radius );
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
		const tempText = Utility.DefaultData( tempModel.text, tempTypeData.text );
		const tempStroke = Utility.DefaultData( tempModel.stroke, tempTypeData.stroke );

		// Render
		return (
			<g className={ "edge " + this.constructor.name + ( tempModel.isSelected ? " selected" : "" ) }>
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
	onPhysics: PropTypes.func.isRequired
};

export default observer( Edge );