import React from "react";
import PropTypes from "prop-types";
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
			isOpen: false
		};
		
		// Events
		this._onOpen = () => { this.setState( { isOpen: !this.state.isOpen } ); };
	}
	
	render( tStyle = Style )
	{
		// Content
		const tempContent = this.renderContent();
		
		// Class
		var tempClass = `${ tStyle.item }`;
		if ( this.state.isOpen )
		{
			tempClass += ` ${ tStyle.open }`;
		}
		
		// Render
		return (
			<div className={ tempClass }>
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

Item.propTypes =
{
	isEditable: PropTypes.bool.isRequired
};

Item.defaultProps =
{
	isEditable: true
};