import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphBase from "../../../nodegraph-base/views/graph/Graph";
import GraphModel from "../../models/Graph";
import NodeMenus from "./overlays/NodeMenus";
import EdgeTypeMenu from "./overlays/EdgeTypeMenu";
import Edges from "./edges/Edges";
import Nodes from "./nodes/Nodes";
import Grid from "../../../nodegraph-base/views/graph/Grid";
import Arrows from "./edges/Arrows";
import Style from "./Graph.module.css";

class Graph extends GraphBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._edgeTypeMenu = null;
		
		// Events
		this._onEdgeTypeMenu = ( tComponent ) => { this._edgeTypeMenu = tComponent; };
		this._onTargetPin = ( tModel ) => { this._edgeTypeMenu.targetPin = tModel; };
	}
	
	componentWillUnmount()
	{
		// Inheritance
		super.componentWillUnmount();
		
		// Clear physics
		this.props.model._physics.destroy();
	}
	
	onMouseDown( tEvent )
	{
		// Inheritance
		super.onMouseDown( tEvent );
		
		// Clear pin
		const tempModel = this.props.model;
		if ( !tempModel.isPanning )
		{
			tempModel.linkingPin = null;
		}
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
			<svg className={ tempClass } onWheel={ this._onMouseWheel }>
				<Arrows graph={ tempModel }/>
				<Grid graph={ tempModel }/>
				<rect width="100%" height="100%" fillOpacity="0" onMouseDown={ this._onMouseDown }/>
				<g ref={ this._onViewElement }>
					<g ref={ this._onContainerElement }>
						<Edges ref={ this._onEdges } graph={ tempModel }/>
						<Nodes graph={ tempModel } onLink={ this._onLink } onTargetPin={ this._onTargetPin }/>
						<EdgeTypeMenu ref={ this._onEdgeTypeMenu } graph={ tempModel }/>
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