import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeModel from "../../../models/Node";
import NodeMenu from "./../overlays/NodeMenu";
import Pin from "./Pin";
import Style from "./Node.module.css";

class Node extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._element = null;
		this._clickTimeout = null;
		
		// Events
		this._onPositionDispose = observe( tProps.model, "position", ( tChange ) => { this.position = tChange.newValue; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}
	
	componentDidMount()
	{
		this.position = this.props.model.position;
	}
	
	componentWillUnmount()
	{
		this._onPositionDispose();
		this._onPositionDispose = null;
		
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
			if ( tempModel._isSelected )
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
			else
			{
				tempModel._graph.addSelectedNode( tempModel );
			}
			
			// Set
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
			
			const tempModel = this.props.model;
			if ( tempModel._isSelected )
			{
				tempModel._graph.removeSelectedNode( tempModel );
			}
			else
			{
				tempModel._graph.addSelectedNode( tempModel );
			}
		}
	}

	set position( tPosition )
	{
		this._element.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	render( tStyle = Style )
	{
		// Variables
		const tempModel = this.props.model;
		const tempRadius = 5;
		const tempOutlineDiameter = ( tempRadius + 10 ) * 2;
		
		// Class
		var tempClass = `${ tStyle.node }`;
		if ( tempModel._isSelected )
		{
			tempClass += ` ${ tStyle.selected }`;
		}
		
		// Render
		return (
			<g className={ tempClass } guid={ tempModel._id } ref={ this._onElement }>
				<rect className={ tStyle.outline } stroke="#000000" fillOpacity="0" height={ tempOutlineDiameter } width={ tempOutlineDiameter } x={ -tempOutlineDiameter * 0.5 } y={ -tempOutlineDiameter * 0.5 } strokeDasharray={ tempOutlineDiameter * 0.125 + " " + tempOutlineDiameter * 0.75 + " " + tempOutlineDiameter * 0.125 + " 0" }/>
				<circle className={ tStyle.graphic } cx="0" cy="0" r={ tempRadius } onMouseDown={ this._onMouseDown } onMouseUp={ this._onMouseUp }/>
				<g className={ tStyle.pins }>
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
					tempModel._isSelected &&
						<NodeMenu node={ tempModel } onLinking={ this.props.onLinking }/>
				}
			</g>
		);
	}
}

Node.propTypes =
{
	model: PropTypes.instanceOf( NodeModel ).isRequired,
	onLink: PropTypes.func.isRequired,
	onDragStart: PropTypes.func.isRequired
};

export default observer( Node );