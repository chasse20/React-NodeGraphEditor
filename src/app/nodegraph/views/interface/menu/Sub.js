import React from "react";
import PropTypes from "prop-types";
import Icons from "../../Icons";
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
		this._onOpen = () => { this.setState( { isOpen: !this.state.isOpen } ); };
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
				<button className={ tStyle.toggle } onClick={ this._onOpen }>
					{ Icons.arrow }
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