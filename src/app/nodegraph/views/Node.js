import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeModel from "../Node";
import Utility from "../Utility";
import Pin from "./Pin";
import "./Node.css";

class Node extends React.Component
{
	static SerializableClasses = { "Node": Node };
	
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._element = null;
		
		// Events
		this._onTransformDispose = observe( tProps.model._transform, "_position", ( tChange ) => { this.updateTransform(); } );
		this._onMouse = ( tEvent ) => { tProps.onSelect( tEvent, this.props.model ); };
		this._onElement = ( tElement ) => { this._element = tElement; };
	}
	
	componentDidMount()
	{
		this.updateTransform();
	}
	
	componentWillUnmount()
	{
		if ( this.props.model.isSelected )
		{
			this.props.onSelect( null, this.props.model );
		}
		
		this._onTransformDispose();
		this._onTransformDispose = null;
	}
	
	updateTransform()
	{
		const tempPosition = this.props.model._transform._position;
		this._element.setAttribute( "transform", "translate(" + tempPosition.x + "," + tempPosition.y + ")" );
	}
	
	render() // TODO: Optimize via breakup of text and graphics????
	{
		const tempModel = this.props.model;
		const tempData = tempModel.data;
		const tempTypeData = tempModel._type.data;
		const tempRadius = Utility.DefaultData( "radius", tempData, tempTypeData, this.props.radius );
		const tempOutlineDiameter = ( tempRadius + 10 ) * 2;
		
		return (
			<g className={ "node " + this.constructor.name + ( this.props.model.isSelected ? " selected" : "" ) } guid={ this.props.model._id } ref={ this._onElement } onMouseDown={ this._onMouse } onMouseUp={ this._onMouse }>
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
						Object.values( this.props.model._pins ).map(
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
	onSelect: PropTypes.func.isRequired,
	radius: PropTypes.number
};

Node.defaultProps =
{
	radius: 50
};

export default observer( Node );