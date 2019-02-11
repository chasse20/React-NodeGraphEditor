import React from "react";
import PropTypes from "prop-types";
import Icons from "../../Icons";
import Style from "./Menu.module.css";

export default class Menu extends React.PureComponent
{
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.button }`;
		if ( this.props.isMenuOpen )
		{
			tempClass += ` ${ tStyle.open }`;
		}
		
		// Render
		return (
			<button className={ tempClass } onClick={ this.props.onToggle }>
				{ Icons.menu }
			</button>
		);
	}
}

Menu.propTypes =
{
	onToggle: PropTypes.func.isRequired,
	isMenuOpen: PropTypes.bool
};

Menu.defaultProps =
{
	isMenuOpen: false
};