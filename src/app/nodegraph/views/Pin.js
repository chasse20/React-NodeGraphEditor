import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import PinModel from "../Pin";

class Pin extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		if ( tProps.model._isOut )
		{
			this._onLinksDispose = observe( tProps.model._links, ( tChange ) => { this.onLinks( tChange ); } );
		}
	}
	
	componentDidMount()
	{
		if ( this.props.model._isOut )
		{
			const tempPins = this.props.model._links;
			for ( let tempKey in tempPins )
			{
				this.props.onLink( tempPins[ tempKey ], true );
			}
		}
	}
	
	componentWillUnmount()
	{
		if ( this.props.model._isOut )
		{
			this._onLinksDispose();
			this._onLinksDispose = null;
			
			const tempPins = this.props.model._links;
			for ( let tempKey in tempPins )
			{
				this.props.onLink( tempPins[ tempKey ] );
			}
		}
	}
	
	onLinks( tChange )
	{
		if ( tChange.type === "add" )
		{
			this.props.onLink( tChange.newValue, true );
		}
		else
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
	model: PropTypes.instanceOf( PinModel ).isRequired
};

export default observer( Pin );