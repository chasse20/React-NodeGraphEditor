import React from "react";
import PropTypes from "prop-types";
import InterfaceModel from "../Interface";
import Transform2DModel from "../../core/Transform2D";
import SelectionControls from "./SelectionControls";
import GridControls from "./GridControls";
import ZoomControls from "./ZoomControls";
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
			isMenuOpen: false
		};
		
		// Events
		this._onToggleMenu = () => { this.setState( { isMenuOpen: !this.state.isMenuOpen } ); };
	}
	
	render() // TODO: Side menu
	{
		return (
			<div className={ this.state.isMenuOpen ? "interface open" : "interface" }>
				<div className="panel">
				</div>
				<nav>
					<button className={ this.state.isMenuOpen ? "menu-toggle open" : "menu-toggle" } onClick={ this._onToggleMenu }>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 269 24 24">
							<rect x="0" y="286" width="24" height="2"/>
							<rect x="0" y="280" width="24" height="2"/>
							<rect x="0" y="274" width="24" height="2"/>
						</svg>
					</button>
					<div className="buttons">
						<SelectionControls model={ this.props.model._selection }/>
						<GridControls model={ this.props.model._grid } selection={ this.props.model._selection }/>
						<ZoomControls model={ this.props.model._zoom } viewTransform={ this.props.viewTransform }/>
					</div>
				</nav>
			</div>
		);
	}
}

Interface.propTypes =
{
	model: PropTypes.instanceOf( InterfaceModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};