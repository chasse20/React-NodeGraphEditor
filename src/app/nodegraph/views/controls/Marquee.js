import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../models/Graph";
import Icons from "../Icons";
import Style from "./Marquee.module.css";

class Marquee extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onToggle = () => { this.props.graph.isPanMode = false; };
	}
	
	render( tStyle = Style )
	{
		return (
			<button className={ tStyle.button } onMouseDown={ this._onToggle } disabled={ !this.props.graph.isPanMode }>
				{ Icons.marquee }
			</button>
		);
	}
}

Marquee.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Marquee );