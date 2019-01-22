import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeModel from "../../../models/Node";
import Pin from "../pin/Pin";
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
		this._clickTimeout = null;
		
		// Events
		this._onPositionDispose = observe( tProps.model, "position", ( tChange ) => { this.position = tChange.newValue; } );
		this._onSelectedDispose = observe( tProps.model, "isSelected", ( tChange ) => { this.props.onSelected( this.props.model ); } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}
	
	componentDidMount()
	{
		const tempModel = this.props.model;
		
		this.isSelected = tempModel.isSelected;
		this.position = tempModel.position;
	}
	
	componentWillUnmount()
	{
		this.isSelected = false;
		
		this._onPositionDispose();
		this._onPositionDispose = null;
		this._onSelectedDispose();
		this._onSelectedDispose = null;
		
		if ( this._clickTimeout !== null )
		{
			clearTimeout( this._clickTimeout );
		}
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

	set position( tPosition )
	{
		this._element.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	render()
	{
		const tempModel = this.props.model;
		const tempRadius = 10;
		const tempOutlineDiameter = ( tempRadius + 10 ) * 2;
		
		return (
			<g className={ "node " + this.constructor.name + ( tempModel.isSelected ? " selected" : "" ) } guid={ tempModel._id } ref={ this._onElement }>
				<rect className="outline" height={ tempOutlineDiameter } width={ tempOutlineDiameter } x={ -tempOutlineDiameter * 0.5 } y={ -tempOutlineDiameter * 0.5 } strokeDasharray={ tempOutlineDiameter * 0.125 + " " + tempOutlineDiameter * 0.75 + " " + tempOutlineDiameter * 0.125 + " 0" }/>
				<circle className="graphic" cx="0" cy="0" r={ tempRadius } onMouseDown={ this._onMouseDown } onMouseUp={ this._onMouseUp }/>
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
			</g>
		);
	}
}

Node.propTypes =
{
	model: PropTypes.instanceOf( NodeModel ).isRequired,
	onLink: PropTypes.func.isRequired,
	onSelected: PropTypes.func.isRequired,
	onDragStart: PropTypes.func.isRequired
};

export default observer( Node );