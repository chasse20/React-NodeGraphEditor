import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import Icons from "../../Icons";
import Style from "./Physics.module.css";

class Physics extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onToggle = () => { this.props.graph.isPhysics = !this.props.graph.isPhysics; };
	}
	
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.button }`;
		if ( !this.props.graph.isPhysics )
		{
			tempClass += ` ${ tStyle.deselected }`;
		}
		
		// Render
		return (
			<button className={ tempClass } onMouseDown={ this._onToggle }>
				{ Icons.physics }
			</button>
		);
	}
}

Physics.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Physics );