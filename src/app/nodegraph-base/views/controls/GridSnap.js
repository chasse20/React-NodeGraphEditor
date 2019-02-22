import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../models/Graph";
import Icons from "../Icons";
import Style from "./GridSnap.module.css";

class GridSnap extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onToggle = () => { this.props.graph.isGridSnap = !this.props.graph.isGridSnap; };
	}
	
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.button }`;
		if ( !this.props.graph.isGridSnap )
		{
			tempClass += ` ${ tStyle.deselected }`;
		}
		
		return (
			<button className={ tempClass } onMouseDown={ this._onToggle }>
				{ Icons.gridSnap }
			</button>
		);
	}
}

GridSnap.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( GridSnap );