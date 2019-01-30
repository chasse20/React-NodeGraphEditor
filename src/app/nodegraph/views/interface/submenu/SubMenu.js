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
		return (
			<div className={ this.state.isOpen ? "submenu open" : "submenu" }>
				<button className="submenu-toggle" onClick={ this._onStateToggle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M10 17l5-5-5-5v10z"/>
					</svg>
					<div>{ tTitle }</div>
				</button>
				{ this.renderContent() }
			</div>
		);
	}
	
	renderContent()
	{
		return null;
	}
}