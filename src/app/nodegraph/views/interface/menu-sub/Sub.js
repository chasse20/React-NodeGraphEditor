import React from "react";
import PropTypes from "prop-types";
import "./Sub.css";

export default class Sub extends React.Component
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
	
	render()
	{
		// Class
		var tempClass = "sub" + this.specificClass;
		if ( this.state.isOpen )
		{
			tempClass += " open";
		}
		
		// Content
		const tempContent = this.renderContent();
		
		// Render
		return (
			<div className={ tempClass }>
				<button className="sub-toggle" onClick={ this._onStateToggle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" xmlSpace="preserve">
						<path d="M0,24l12-12L0,0V24z"/>
					</svg>
					<span>{ this.props.title }</span>
				</button>
				{
					tempContent != null &&
						<div className="sub-content">
							<div className="sub-inner">
								{ tempContent }
							</div>
							<div className="sub-accent"/>
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

Sub.propTypes =
{
	title: PropTypes.string
};