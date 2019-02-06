import React from "react";
import "./SubItem.css";

export default class SubItem extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state =
		{
			isOpen: false
		};
		
		// Events
		this._onStateToggle = () => { this.setState( { isOpen: !this.state.isOpen } ); };
	}
	
	get specificClass()
	{
		return "";
	}
	
	render()
	{
		// Class
		var tempClassName = "sub-item" + this.specificClass;
		if ( this.state.isOpen )
		{
			tempClassName += " open";
		}
		
		return (
			<div className={ tempClassName }>
				{ this.renderToggle() }
				{ this.renderContent() }
			</div>
		);
	}
	
	renderToggle()
	{
		return null;
	}
	
	renderContent()
	{
		return null;
	}
}