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
		return (
			<div className={ this.state.isOpen ? "submenu open" : "submenu" }>
				<button onMouseDown={ this._onStateToggle }><h1>Title</h1></button>
				<div className="submenu-content"/>
			</div>
		);
	}
}