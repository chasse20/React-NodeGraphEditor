import React from "react";
import "./Item.css";

export default class Item extends React.Component // TODO: Why have open?
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state =
		{
			isOpen: true
		};
		
		// Events
		this._onStateToggle = () => { this.setState( { isOpen: !this.state.isOpen } ); };
	}
	
	get specificClass()
	{
		return this.state.isOpen ? " open" : "";
	}
	
	render()
	{
		// Content
		const tempContent = this.renderContent();
		
		// Render
		return (
			<div className={ "item" + this.specificClass }>
				<div className="item-bar">
					{ this.renderBar() }
				</div>
				{
					tempContent != null &&
						<div className="item-content">
							{ tempContent }
						</div>
				}
			</div>
		);
	}
	
	renderBar()
	{
		return null;
	}
	
	renderContent()
	{
		return null;
	}
}