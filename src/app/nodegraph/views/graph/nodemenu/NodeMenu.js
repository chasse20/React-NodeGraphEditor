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
		const tempInnerRadius = 10;
		const tempOuterRadius = 50;
		
		return (
			<g className={ this.props.selected == null ? "node-menu" : "node-menu open" } ref={ this._onElement }>
				<circle fill="#ffffff" fillOpacity="0" x="0" y="0" r={ tempOuterRadius }/>
				<line x1="0" y1={ tempOuterRadius } x2="0" y2={ 60 }/>
				<line x1="0" y1={ -tempOuterRadius } x2="0" y2={ -60 }/>
			</g>
		);
	}
}