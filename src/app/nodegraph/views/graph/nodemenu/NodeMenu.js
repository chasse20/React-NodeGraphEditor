import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import Node from "../node/Node";
import "./NodeMenu.css";

export default class NodeMenu extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._element = null;
		
		// Events
		this._onPositionDispose = tProps.selected == null ? null : observe( tProps.selected, "position", ( tChange ) => { this.position = tChange.newValue; } );;
		this._onElement = ( tElement ) => { this._element = tElement; };
	}
	
	componentDidMount()
	{
		if ( this.props.selected != null )
		{
			this.position = this.props.selected.position;
		}
	}
	
	componentWillUnmount()
	{
		if ( this._onPositionDispose !== null )
		{
			this._onPositionDispose();
			this._onPositionDispose = null;
		}
	}
	
	componentDidUpdate( tPreviousProps )
	{
		if ( tPreviousProps.selected !== this.props.selected )
		{
			if ( this._onPositionDispose !== null )
			{
				this._onPositionDispose();
			}
			
			if ( this.props.selected === null )
			{
				this._onPositionDispose = null;
			}
			else
			{
				this.position = this.props.selected.position;
				this._onPositionDispose = observe( this.props.selected, "position", ( tChange ) => { this.position = tChange.newValue; } );
			}
		}
	}
	
	set position( tPosition )
	{
		this._element.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	render()
	{
		const tempOuterRadius = 60;
		const tempCircumference = 2 * Math.PI * tempOuterRadius;
		
		return (
			<g className={ this.props.selected == null ? "node-menu" : "node-menu open" } ref={ this._onElement }>
				<circle className="delete" strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ tempOuterRadius } onMouseDown={ ( tEvent ) => { tEvent.stopPropagation(); console.log( "DD" ); } }/>
				<circle className="link" strokeDasharray={ tempCircumference * 0.5 } cx="0" cy="0" r={ tempOuterRadius } onMouseDown={ ( tEvent ) => { tEvent.stopPropagation(); console.log( "DD" ); } }/>
			</g>
		);
	}
}