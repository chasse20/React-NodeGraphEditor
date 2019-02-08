import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeBase from "../../../../nodegraph/views/graph/node/Node";
import NodeMenu from "../../../../nodegraph/views/graph/nodemenu/NodeMenu";
import GraphModel from "../../../models/Graph";
import NodeModel from "../../../models/Node";
import Pin from "../../../../nodegraph/views/graph/pin/Pin";
import "./Node.css";

class Node extends NodeBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		//this._physicsBody = this.createPhysics();
		
		// Events
		this._onSelectedDispose = observe( tProps.model, "_isSelected", ( tChange ) => { this.isSelected = tChange.newValue; } );
	}
	
	componentDidMount()
	{
		super.componentDidMount();
		
		this.isSelected = this.props.model._isSelected;
		//this.props.onPhysics( this._physicsBody, true );
	}
	
	componentWillUnmount()
	{
		super.componentWillUnmount();
		
		//this.props.onPhysics( this._physicsBody, false );
	}
	
	/*createPhysics()
	{
		const tempModel = this.props.model;
		
		return {
			id: tempModel._id,
			x: tempModel.position.x,
			y: tempModel.position.y,
			model: tempModel
		};
	}
	
	set isSelected( tIsSelected )
	{
		// Physics
		if ( tIsSelected )
		{
			this._physicsBody.fx = this.props.model.position.x;
			this._physicsBody.fy = this.props.model.position.y;
		}
		else
		{
			delete this._physicsBody.fx;
			delete this._physicsBody.fy;
		}
	}

	set position( tPosition )
	{
		// Physics
		if ( this.props.model._isSelected )
		{
			this._physicsBody.fx = tPosition.x;
			this._physicsBody.fy = tPosition.y;
		}
		
		this._physicsBody.x = tPosition.x;
		this._physicsBody.y = tPosition.y;
		
		// Inheritance
		super.position = tPosition;
	}*/
	
	render()
	{
		// Variables
		const tempModel = this.props.model;
		const tempText = tempModel.text;
		const tempType = tempModel._type;
		const tempRadius = tempType.radius;
		const tempOutlineDiameter = ( tempRadius + 10 ) * 2;
		const tempFill = tempType.fill;
		
		// Class
		var tempClass = "node " + this.constructor.name;
		if ( tempModel._isSelected )
		{
			tempClass += " selected";
		}
		
		if ( tempType.isVisible )
		{
			tempClass += " visible";
		}
		
		// Render
		return (
			<g className={ tempClass } guid={ tempModel._id } ref={ this._onElement }>
				<rect className="outline" stroke={ tempFill } height={ tempOutlineDiameter } width={ tempOutlineDiameter } x={ -tempOutlineDiameter * 0.5 } y={ -tempOutlineDiameter * 0.5 } strokeDasharray={ tempOutlineDiameter * 0.125 + " " + tempOutlineDiameter * 0.75 + " " + tempOutlineDiameter * 0.125 + " 0" }/>
				<circle className="graphic" cx="0" cy="0" r={ tempRadius } fill={ tempFill } stroke={ tempType.stroke } onMouseDown={ this._onMouseDown } onMouseUp={ this._onMouseUp }/>
				<g className="pins">
					{
						Object.values( tempModel._pins ).map(
							( tPin ) =>
							(
								<Pin model={ tPin } key={ tPin.id } onLink={ this.props.onLink }/>
							)
						)
					}
				</g>
				{
					tempText != null &&
						<foreignObject width={ tempRadius * 2 } height={ tempRadius * 2 } x={ -tempRadius } y={ -tempRadius }>
							<div className="text" style={ { height: tempRadius * 2 } }>
								<p>{ tempText }</p>
							</div>
						</foreignObject>
				}
				{
					tempModel._isSelected &&
						<NodeMenu radius={ tempRadius + 40 } onRemove={ this._onRemove } onLinking={ this.props.onLinking }/>
				}
			</g>
		);
	}
}

Node.propTypes = Object.assign(
	{},
	NodeBase.propTypes,
	{
		model: PropTypes.instanceOf( NodeModel ).isRequired,
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);

export default observer( Node );