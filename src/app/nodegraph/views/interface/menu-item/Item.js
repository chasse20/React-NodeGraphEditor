import React from "react";
import "./Item.css";

export default class Item extends React.Component // TODO: Why have open?
{
	get specificClass()
	{
		return "";
	}
	
	render()
	{
		// Class
		var tempClassName = "item" + this.specificClass;
		
		// Content
		const tempContent = this.renderContent();
		
		// Render
		return (
			<div className={ tempClassName }>
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