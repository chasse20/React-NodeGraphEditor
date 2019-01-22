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
		
		// Physics
		this._physicsBody = this.createPhysics();
		
		// Variables
		this._element = null;
		this._clickTimeout = null;
		
		// Events
		this._onPositionDispose = observe( tProps.model, "position", ( tChange ) => { this.position = tChange.newValue; } );
		this._onSelectedDispose = observe( tProps.model, "isSelected", ( tChange ) => { this.isSelected = tChange.newValue; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}
	
	componentDidMount()
	{
		const tempModel = this.props.model;
		
		this.isSelected = tempModel.isSelected;
		this.position = tempModel.position;
		this.props.onPhysics( this._physicsBody, true );
	}
	
	componentWillUnmount()
	{
		this.isSelected = false;
		this.props.onPhysics( this._physicsBody, false );
		
		this._onPositionDispose();
		this._onPositionDispose = null;
		this._onSelectedDispose();
		this._onSelectedDispose = null;
		
		if ( this._clickTimeout !== null )
		{
			clearTimeout( this._clickTimeout );
		}
	}
	
	createPhysics()
	{
		const tempModel = this.props.model;
		
		return {
			id: tempModel._id,
			x: tempModel.position.x,
			y: tempModel.position.y,
			model: tempModel
		};
	}
	
	onMouseDown( tEvent )
	{
		// Select
		tEvent.stopPropagation();
		if ( tEvent.button !== 1 ) // middle-mouse is reserved
		{
			// Check for selection toggle click if node is already selected
			const tempModel = this.props.model;
			if ( tempModel.isSelected )
			{
				clearTimeout( this._clickTimeout );
				this._clickTimeout = setTimeout(
					() =>
					{
						this._clickTimeout = null;
					},
					200
				);
			}
			
			// Set
			tempModel.isSelected = true;
			this.props.onDragStart( tEvent );
		}
	}
	
	onMouseUp( tEvent )
	{
		// Toggle node selection if within simulated click time
		tEvent.stopPropagation();
		if ( tEvent.button !== 1 && this._clickTimeout !== null ) // middle-mouse is reserved
		{
			clearTimeout( this._clickTimeout );
			this._clickTimeout = null;
			
			this.props.model.isSelected = !this.props.model.isSelected;
		}
	}
	
	set isSelected( tIsSelected )
	{
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
		
		this.props.onSelected( this.props.model );
	}
	
	set position( tPosition )
	{
		if ( this.props.model.isSelected )
		{
			this._physicsBody.fx = tPosition.x;
			this._physicsBody.fy = tPosition.y;
		}
		
		this._physicsBody.x = tPosition.x;
		this._physicsBody.y = tPosition.y;
		this._element.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	render() // TODO: Optimize via breakup of text and graphics????
	{
		const tempModel = this.props.model;
		const tempData = tempModel.data;
		const tempTypeData = tempModel._type.data;
		const tempRadius = Utility.DefaultData( tempData.radius, tempTypeData.radius );
		const tempOutlineDiameter = ( tempRadius + 10 ) * 2;
		const tempFill = Utility.DefaultData( tempData.fill, tempTypeData.fill );
		
		return (
			<g className={ "node " + this.constructor.name + ( tempModel.isSelected ? " selected" : "" ) } guid={ tempModel._id } ref={ this._onElement }>
				<rect className="outline" stroke={ tempFill } height={ tempOutlineDiameter } width={ tempOutlineDiameter } x={ -tempOutlineDiameter * 0.5 } y={ -tempOutlineDiameter * 0.5 } strokeDasharray={ tempOutlineDiameter * 0.125 + " " + tempOutlineDiameter * 0.75 + " " + tempOutlineDiameter * 0.125 + " 0" }/>
				<circle className="graphic" cx="0" cy="0" r={ tempRadius } fill={ tempFill } stroke={ Utility.DefaultData( tempData.stroke, tempTypeData.stroke ) } onMouseDown={ this._onMouseDown } onMouseUp={ this._onMouseUp }/>
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
	onPhysics: PropTypes.func.isRequired,
	onSelected: PropTypes.func.isRequired,
	onDragStart: PropTypes.func.isRequired
};

export default observer( Node );