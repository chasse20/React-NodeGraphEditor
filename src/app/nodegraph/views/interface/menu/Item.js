import React from "react";
import Style from "./Item.module.css";

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
	
	render( tStyle = Style )
	{
		// Content
		const tempContent = this.renderContent();
		
		// Render
		return (
			<div>
				<div className={ tStyle.bar }>
					{ this.renderBar() }
				</div>
				{
					tempContent != null &&
						<div className={ tStyle.content }>
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