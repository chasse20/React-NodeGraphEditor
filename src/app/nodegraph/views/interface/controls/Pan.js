import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import Style from "./Pan.module.css";

class Pan extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onPan = () => { this.props.graph.isPanMode = true; };
	}
	
	render( tStyle = Style )
	{
		const tempIsPanning = this.props.graph.isPanMode || this.props.graph.isPanning;
		
		return (
			<button className={ tStyle.button } onMouseDown={ this._onPan } disabled={ tempIsPanning }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M23.6,11.6l-3.7-3.4C19.5,8,19,8.2,19,8.6v1.9c0,0.3-0.2,0.5-0.5,0.5h-5c-0.3,0-0.5-0.2-0.5-0.5v-5C13,5.2,13.2,5,13.5,5 h1.9c0.4,0,0.7-0.5,0.4-0.8l-3.4-3.7c-0.2-0.2-0.6-0.2-0.8,0L8.3,4.2C8,4.5,8.2,5,8.6,5h1.9C10.8,5,11,5.2,11,5.5v5 c0,0.3-0.2,0.5-0.5,0.5h-5C5.2,11,5,10.8,5,10.5V8.6C5,8.2,4.5,8,4.1,8.3l-3.7,3.4c-0.2,0.2-0.2,0.6,0,0.8l3.7,3.4 C4.5,16,5,15.8,5,15.4v-1.9C5,13.2,5.2,13,5.5,13h5c0.3,0,0.5,0.2,0.5,0.5v5c0,0.3-0.2,0.5-0.5,0.5H8.6c-0.4,0-0.7,0.5-0.4,0.8 l3.4,3.7c0.2,0.2,0.6,0.2,0.8,0l3.4-3.7c0.3-0.3,0.1-0.8-0.4-0.8h-1.9c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h5 c0.3,0,0.5,0.2,0.5,0.5v1.9c0,0.4,0.5,0.7,0.8,0.4l3.7-3.4C23.8,12.2,23.8,11.8,23.6,11.6z"/>
				</svg>
			</button>
		);
	}
}

Pan.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Pan );