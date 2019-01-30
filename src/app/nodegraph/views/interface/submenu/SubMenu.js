import React from "react";
import "./SubMenu.css";

export default class SubMenu extends React.Component
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
	
	render()
	{
		return this.renderSubmenu();
	}
	
	renderSubmenu( tTitle )
	{
		var tempClassName = "submenu " + tTitle;
		if ( this.state.isOpen )
		{
			tempClassName += " open";
		}
		
		return (
			<div className={ tempClassName }>
				<button className="toggle" onClick={ this._onStateToggle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" xmlSpace="preserve">
						<path d="M0,24l12-12L0,0V24z"/>
					</svg>
					<div>{ tTitle }</div>
				</button>
				<div className="subcontent">
					{ this.renderContent() }
				</div>
			</div>
		);
	}
	
	renderContent()
	{
		return null;
	}
}