import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeModel from "../../../../Node";
import Utility from "../../../../Utility";
import Pin from "./pin/Pin";
import "./Node.css";

class Node extends React.Component
{
	static SerializableClasses = { "default": Node, "Node": Node };
	
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._element = null;
		/*this._physics =
		{
			id: tProps.model._id,
			x: tProps.model._transform._position.x,
			y: tProps.model._transform._position.y,
			transform: tProps.model._transform,
			radius: 100
		};*/
		
		// Events
		this._onPositionDispose = observe( tProps.model, "_position", ( tChange ) => { this.position = tChange.newValue; } );
		//this._onSelectedDispose = observe( tProps.model, "isSelected", ( tChange ) => { this.isSelected = tChange.newValue; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onMouseDown = ( tEvent ) => { this.props.onMouseDown( tEvent, this.props.model ); };
		this._onMouseUp = ( tEvent ) => { this.props.onMouseUp( tEvent, this.props.model ); };
	}
	
	componentDidMount()
	{
		this.position = this.props.model._position;
		this.isSelected = this.props.isSelected;
		//this.props.onPhysics( this._physics, true );
	}
	
	componentWillUnmount()
	{
		this.isSelected = false;
		
		this._onPositionDispose();
		this._onPositionDispose = null;
		//this._onSelectedDispose();
		//this._onSelectedDispose = null;
		
		//this.props.onPhysics( this._physics, false );
	}
	
	set isSelected( tIsSelected )
	{
		/*if ( tIsSelected )
		{
			this._physics.fx = this.props.model._transform._position.x;
			this._physics.fy = this.props.model._transform._position.y;
		}
		else
		{
			delete this._physics.fx;
			delete this._physics.fy;
		}*/
		
		//this.props.onPhysics( this._physics, !tIsSelected );
	}
	
	set position( tPosition )
	{
		/*if ( this.props.model.isSelected )
		{
			this._physics.fx = tPosition.x;
			this._physics.fy = tPosition.y;
		}
		
		this._physics.x = tPosition.x;
		this._physics.y = tPosition.y;*/
		this._element.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	render() // TODO: Optimize via breakup of text and graphics????
	{
		const tempModel = this.props.model;
		const tempData = tempModel.data;
		const tempTypeData = tempModel._type.data;
		const tempRadius = Utility.DefaultData( "radius", tempData, tempTypeData, this.props.radius );
		const tempOutlineDiameter = ( tempRadius + 10 ) * 2;
		
		return (
			<g className={ "node " + this.constructor.name + ( tempModel.isSelected ? " selected" : "" ) } guid={ tempModel._id } ref={ this._onElement } onMouseDown={ this._onMouseDown } onMouseUp={ this._onMouseUp }>
				<rect className="outline" height={ tempOutlineDiameter } width={ tempOutlineDiameter } x={ -tempOutlineDiameter * 0.5 } y={ -tempOutlineDiameter * 0.5 } strokeDasharray={ tempOutlineDiameter * 0.125 + " " + tempOutlineDiameter * 0.75 + " " + tempOutlineDiameter * 0.125 + " 0" }/>
				<circle className="graphic" cx="0" cy="0" r={ tempRadius } fill={ Utility.DefaultData( "fill", tempData, tempTypeData, "#019abd" ) } stroke={ Utility.DefaultData( "stroke", tempData, tempTypeData, "#42d3ff" ) }/>
				{
					tempData.text != null &&
						<foreignObject width={ tempRadius * 2 } height={ tempRadius * 2 } x={ -tempRadius } y={ -tempRadius }>
							<div className="text" style={ { height: tempRadius * 2 } }>
								<p>{ tempData.text }</p>
							</div>
						</foreignObject>
				}
				<g className="pins">
					{
						Object.values( tempModel._pins ).map(
							( tPin ) =>
							(
								<Pin model={ tPin } key={ tPin.key } onLink={ this.props.onLink }/>
							)
						)
					}
				</g>
			</g>
		);
	}
}

Node.propTypes =
{
	model: PropTypes.instanceOf( NodeModel ).isRequired,
	onLink: PropTypes.func.isRequired,
	onMouseDown: PropTypes.func.isRequired,
	onMouseUp: PropTypes.func.isRequired,
	radius: PropTypes.number
};

Node.defaultProps =
{
	radius: 50
};

export default observer( Node );