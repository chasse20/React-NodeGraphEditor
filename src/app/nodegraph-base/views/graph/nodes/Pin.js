import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import PinModel from "../../../models/Pin";

export default class Pin extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onLinksDispose = null;
		if ( tProps.model._isOut )
		{
			this._onLinksDispose = observe( tProps.model._links, ( tChange ) => { this.onLinks( tChange ); } );
		}
	}
	
	componentDidMount()
	{
		const tempModel = this.props.model;
		if ( tempModel._isOut )
		{
			const tempPins = tempModel._links;
			for ( let tempKey in tempPins )
			{
				this.props.onLink( tempPins[ tempKey ], true );
			}
		}
	}
	
	componentWillUnmount()
	{
		if ( this._onLinksDispose != null )
		{
			this._onLinksDispose();
			this._onLinksDispose = null;
		}
		
		const tempPins = this.props.model._links;
		for ( let tempKey in tempPins )
		{
			this.props.onLink( tempPins[ tempKey ] );
		}
	}
	
	onLinks( tChange )
	{
		if ( tChange.type === "add" )
		{
			this.props.onLink( tChange.newValue, true );
		}
		else if ( tChange.type === "remove" )
		{
			this.props.onLink( tChange.oldValue );
		}
	}

	render()
	{
		return null;
	}
}

Pin.propTypes =
{
	model: PropTypes.instanceOf( PinModel ).isRequired,
	onLink: PropTypes.func.isRequired,
	radius: PropTypes.number
};

Pin.defaultProps =
{
	radius: 50
};