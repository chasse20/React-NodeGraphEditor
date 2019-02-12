import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphBase from "../../../nodegraph/views/graph/Graph";
import GraphModel from "../../models/Graph";
import Edges from "../../../nodegraph/views/graph/Edges";
import Nodes from "../../../nodegraph/views/graph/Nodes";
import Grid from "../../../nodegraph/views/graph/Grid";
import Arrows from "./Arrows";
import Style from "../../../nodegraph/views/graph/Graph.module.css";

class Graph extends GraphBase
{	
	render( tStyle = Style )
	{
		// Class
		const tempModel = this.props.model;
		var tempClass = `${ tStyle.graph }`;
		if ( tempModel.isPanning )
		{
			tempClass += ` ${ tStyle.panning }`;
		}
		
		if ( tempModel.isMarqueeing )
		{
			tempClass += ` ${ tStyle.marqueeing }`;
		}
		
		// Render
		return (
			<svg className={ tempClass } onWheel={ this._onMouseWheel } onMouseDown={ this._onMouseDown }>
				<Arrows graph={ tempModel }/>
				<Grid graph={ tempModel }/>
				<g ref={ this._onViewElement }>
					<g ref={ this._onContainerElement }>
						<Edges ref={ this._onEdges } graph={ tempModel }/>
						<Nodes graph={ tempModel } onLink={ this._onLink }/>
					</g>
				</g>
				<rect ref={ this._onMarqueeElement } className={ tStyle.marquee }/>
			</svg>
		);
	}
}

Graph.propTypes = Object.assign(
	{},
	GraphBase.propTypes,
	{
		model: PropTypes.instanceOf( GraphModel ).isRequired
	}
);

export default observer( Graph );