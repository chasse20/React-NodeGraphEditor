import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Vector2D from "../../../core/Vector2D";
import GraphModel from "../../models/Graph";
import Icons from "../Icons";
import Style from "./ZoomIn.module.css";

class ZoomIn extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onZoom = () => { this.onZoom(); };
	}
	
	onZoom()
	{
		const tempGraph = this.props.graph;
		if ( tempGraph.zoom < tempGraph.maxZoom )
		{
			var tempAmount = tempGraph.zoom + tempGraph.zoomSpeed;
			if ( tempAmount > tempGraph.maxZoom )
			{
				tempAmount = tempGraph.maxZoom;
			}
			
			const tempX = window.screen.width * 0.5;
			const tempY = window.screen.height* 0.5;
			const tempWorldOffsetStart = new Vector2D( tempX, tempY ).scale( 1 / tempGraph.zoom );
			const tempWorldOffsetEnd = new Vector2D( tempX, tempY ).scale( 1 / tempAmount );
			
			tempGraph.position = tempWorldOffsetEnd.subtract( tempWorldOffsetStart ).add( tempGraph.position );
			tempGraph.zoom = tempAmount;
		}
	}
	
	render( tStyle = Style )
	{
		const tempGraph = this.props.graph;
		
		return (
			<button className={ tStyle.button } onMouseDown={ this._onZoom } disabled={ tempGraph.zoom >= tempGraph.maxZoom }>
				{ Icons.zoomIn }
			</button>
		);
	}
}

ZoomIn.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( ZoomIn );