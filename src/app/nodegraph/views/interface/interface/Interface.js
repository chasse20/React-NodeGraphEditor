import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Controls from "../controls/Controls";
import Menu from "../menu/Menu";
import "./Interface.css";

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
	
	render()
	{
		return (
			<div className={ this.state.isOpen ? "interface open" : "interface" }>
				<Controls graph={ this.props.graph } onMenuToggle={ this._onMenuToggle }/>
				<Menu graph={ this.props.graph }/>
			</div>
		);
	}
}

Interface.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};