import React from "react";
import PropTypes from "prop-types";
import Style from "./Sub.module.css";

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
	
	render( tStyle = Style )
	{
		// Content
		const tempContent = this.renderContent();
		
		// Class
		var tempClass = `${ tStyle.sub }`;
		if ( this.state.isOpen )
		{
			tempClass += ` ${ tStyle.open }`;
		}
		
		// Render
		return (
			<div className={ tempClass }>
				<button className={ tStyle.toggle } onClick={ this._onStateToggle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" xmlSpace="preserve">
						<path d="M0,24l12-12L0,0V24z"/>
					</svg>
					<span>{ this.props.title }</span>
				</button>
				{
					tempContent != null &&
						<div className={ tStyle.content }>
							<div className={ tStyle.inner }>
								{ tempContent }
							</div>
							<div className={ tStyle.accent }/>
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