import React from "react";
import "./Item.css";

export default class Item extends React.Component
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
		var tempClassName = "item" + this.specificClass;
		if ( this.state.isOpen )
		{
			tempClassName += " open";
		}
		
		// Content
		const tempContent = this.renderContent();
		
		// Render
		return (
			<div className={ tempClassName }>
				{
					tempContent != null &&
						<div className="item-content">
							{ tempContent }
						</div>
				}
			</div>
		);
	}
	
	renderContent()
	{
		return null;
	}
}