import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphBase from "../../../nodegraph/views/graph/Graph";
import GraphModel from "../../models/Graph";
import NodeMenus from "./overlays/NodeMenus";
import Edges from "./edges/Edges";
import Nodes from "../../../nodegraph/views/graph/nodes/Nodes";
import Grid from "../../../nodegraph/views/graph/Grid";
import Arrows from "./edges/Arrows";
import Style from "./Graph.module.css";

class Graph extends GraphBase
{
	onMouseDown( tEvent )
	{
		// Inheritance
		super.onMouseDown( tEvent );
		
		// Clear pin
		this.props.model.linkingPin = null;
	}
	
	render( tStyle = Style ) // TODO: Reduce repeated code
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
		
		if ( tempModel.linkingPin != null )
		{
			tempClass += ` ${ tStyle.linking }`;
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
						<NodeMenus graph={ tempModel }/>
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