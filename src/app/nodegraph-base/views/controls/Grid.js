import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../models/Graph";
import Icons from "../Icons";
import Style from "./Grid.module.css";

class Grid extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onToggle = () => { this.props.graph.isGridVisible = !this.props.graph.isGridVisible; };
	}
	
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.button }`;
		if ( !this.props.graph.isGridVisible )
		{
			tempClass += ` ${ tStyle.deselected }`;
		}
		
		// Render
		return (
			<button className={ tempClass } onMouseDown={ this._onToggle }>
				{ Icons.grid }
			</button>
		);
	}
}

Grid.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Grid );