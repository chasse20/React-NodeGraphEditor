import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../models/Graph";
import Controls from "./controls/Controls";
import Style from "./Interface.module.css";

export default class Interface extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this.state =
		{
			isOpen: false
		};
		
		// Events
		this._onMenuToggle = () => { this.setState( { isOpen: !this.state.isOpen } ); };
	}
	
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.interface }`;
		if ( this.state.isOpen )
		{
			tempClass += ` ${ tStyle.open }`;
		}
		
		// Render
		return (
			<div className={ tempClass }>
				<Controls graph={ this.props.graph } onMenuToggle={ this._onMenuToggle } isMenuOpen={ this.state.isOpen }/>
			</div>
		);
	}
}

Interface.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};