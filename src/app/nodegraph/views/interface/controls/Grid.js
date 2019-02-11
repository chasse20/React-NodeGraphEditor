import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
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
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-467 269 24 24">
					<path d="M-445.4,269h-19.2c-1.3,0-2.4,1.1-2.4,2.4v19.2c0,1.3,1.1,2.4,2.4,2.4h19.2c1.3,0,2.4-1.1,2.4-2.4v-19.2 C-443,270.1-444.1,269-445.4,269z M-459,291h-6v-6h6V291z M-459,284h-6v-6h6V284z M-459,277h-6v-6h6V277z M-452,291h-6v-6h6V291z M-452,284h-6v-6h6V284z M-452,277h-6v-6h6V277z M-445,291h-6v-6h6V291z M-445,284h-6v-6h6V284z M-445,277h-6v-6h6V277z"/>
				</svg>
			</button>
		);
	}
}

Grid.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Grid );