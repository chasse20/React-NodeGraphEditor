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
	
	get specificClass()
	{
		return "";
	}
	
	get title()
	{
		return "";
	}
	
	render()
	{
		// Class
		var tempClassName = "sub-menu" + this.specificClass;
		if ( this.state.isOpen )
		{
			tempClassName += " open";
		}
		
		// Render
		return (
			<div className={ tempClassName }>
				<button className="toggle" onClick={ this._onStateToggle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" xmlSpace="preserve">
						<path d="M0,24l12-12L0,0V24z"/>
					</svg>
					<div>{ this.title }</div>
				</button>
				<div className="sub-content">
					<div className="sub-inner">
						{ this.renderContent() }
					</div>
					<div className="accent"/>
				</div>
			</div>
		);
	}
	
	renderContent()
	{
		return null;
	}
}