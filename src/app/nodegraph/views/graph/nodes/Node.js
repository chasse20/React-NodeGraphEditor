import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeBase from "../../../../nodegraph-base/views/graph/nodes/Node";
import NodeModel from "../../../models/Node";
import Pin from "./Pin";
import Style from "./Node.module.css";

class Node extends NodeBase
{
	set position( tPosition )
	{
		// Physics
		if ( this.props.model._isSelected )
		{
			const tempBody = this.props.model._graph._physics.getNodeBody( this.props.model );
			if ( tempBody != null )
			{
				tempBody.fx = tPosition.x;
				tempBody.fy = tPosition.y;
			}
		}
		
		// Inheritance
		super.position = tPosition;
	}
	
	render( tStyle = Style ) // TODO: reduse code repeat
	{
		// Variables
		const tempModel = this.props.model;
		const tempText = tempModel.text;
		const tempType = tempModel._type;
		const tempRadius = tempType.radius;
		const tempOutlineDiameter = ( tempRadius + 10 ) * 2;
		const tempFill = tempType.fill;
		
		// Class
		var tempClass = `${ tStyle.node }`;
		if ( tempModel._isSelected )
		{
			tempClass += ` ${ tStyle.selected }`;
		}
		
		if ( tempType.isVisible )
		{
			tempClass += ` ${ tStyle.visible }`;
		}
		
		// Render
		return (
			<g className={ tempClass } guid={ tempModel._id } ref={ this._onElement }>
				<rect className={ tStyle.outline } stroke={ tempFill } height={ tempOutlineDiameter } width={ tempOutlineDiameter } x={ -tempOutlineDiameter * 0.5 } y={ -tempOutlineDiameter * 0.5 } strokeDasharray={ tempOutlineDiameter * 0.125 + " " + tempOutlineDiameter * 0.75 + " " + tempOutlineDiameter * 0.125 + " 0" }/>
				<circle className={ tStyle.graphic } cx="0" cy="0" r={ tempRadius } fill={ tempFill } onMouseDown={ this._onMouseDown } onMouseUp={ this._onMouseUp }/>
				<g className={ tStyle.pins }>
					{
						Object.values( tempModel._pins ).map(
							( tPin ) =>
							(
								<Pin model={ tPin } key={ tPin.id } onLink={ this.props.onLink } radius={ tempRadius } onTarget={ this.props.onTargetPin }/>
							)
						)
					}
				</g>
				{
					tempText != null &&
						<foreignObject width={ tempRadius * 2 } height="1000" x={ -tempRadius } y={ -tempRadius }>
							<div className={ tStyle.text } style={ { height: tempRadius * 2 } }>
								<p>{ tempText }</p>
							</div>
						</foreignObject>
				}
			</g>
		);
	}
}

Node.propTypes = Object.assign(
	{
		onTargetPin: PropTypes.func.isRequired
	},
	NodeBase.propTypes,
	{
		model: PropTypes.instanceOf( NodeModel ).isRequired
	}
);

export default observer( Node );