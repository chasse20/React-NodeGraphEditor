import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../../models/Graph";
import OptionsModel from "../../../../models/Options";
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
	}
	
	render()
	{
		return (
			<div className={ this.state.isOpen ? "interface open" : "interface" }>
				<Controls options={ this.props.options } graph={ this.props.graph }/>
			</div>
		);
	}
}

Interface.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	options: PropTypes.instanceOf( OptionsModel ).isRequired
};