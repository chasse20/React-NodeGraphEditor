import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import MenuModel from "../Menu";
import "./MenuToggle.css";

class MenuToggle extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Events
		this._onToggleMenu = ( tComponent ) => { this.props.model.isOpen = !this.props.model.isOpen; };
	}
	
	render()
	{
		return (
			<button className={ this.props.model.isOpen ? "menu-toggle open" : "menu-toggle" } onClick={ this._onToggleMenu }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 269 24 24">
					<rect x="0" y="286" width="24" height="2"/>
					<rect x="0" y="280" width="24" height="2"/>
					<rect x="0" y="274" width="24" height="2"/>
				</svg>
			</button>
		);
	}
}

export default observer( MenuToggle );

MenuToggle.propTypes =
{
	model: PropTypes.instanceOf( MenuModel ).isRequired
};