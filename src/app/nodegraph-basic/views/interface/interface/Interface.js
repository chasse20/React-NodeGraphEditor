import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import OptionsModel from "../../../models/Options";
import Menu from "../menu/Menu";
import MenuToggle from "../menu-toggle/MenuToggle";
import Controls from "../controls/Controls";
import "./Interface.css";

export default class Interface extends React.Component
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
		this._onMenuToggle = () => { this.setState( { isOpen: !this.state.isOpen } ); console.log( "??" ); };
	}
	
	render()
	{
		return (
			<div className={ this.state.isOpen ? "interface open" : "interface" }>
				<Menu graph={ this.props.graph }/>
				<nav>
					<MenuToggle onToggle={ this._onMenuToggle }/>
					<Controls options={ this.props.options } graph={ this.props.graph }/>
				</nav>
			</div>
		);
	}
}

Interface.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	options: PropTypes.instanceOf( OptionsModel ).isRequired
};