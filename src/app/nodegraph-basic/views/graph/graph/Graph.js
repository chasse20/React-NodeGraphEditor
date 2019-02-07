import React from "react";
import { observer } from "mobx-react";
import GraphBase from "../../../../nodegraph/views/graph/graph/Graph";
import Edges from "../../../../nodegraph/views/graph/edges/Edges";
import Nodes from "../../../../nodegraph/views/graph/nodes/Nodes";
import Grid from "../../../../nodegraph/views/graph/grid/Grid";
import Arrows from "../arrows/Arrows";

class Graph extends GraphBase
{	
	render()
	{
		// Class
		const tempModel = this.props.model;
		var tempClass = "graph";
		if ( tempModel.isPanning )
		{
			tempClass += " panning";
		}
		
		if ( tempModel.isMarqueeing )
		{
			tempClass += " marqueeing";
		}
		
		// Render
		return (
			<svg className={ tempClass } onWheel={ this._onMouseWheel } onMouseDown={ this._onMouseDown }>
				<Arrows graph={ tempModel }/>
				<Grid graph={ tempModel }/>
				<g ref={ this._onViewElement }>
					<g ref={ this._onContainerElement }>
						<Edges ref={ this._onEdges }/>
						<Nodes graph={ tempModel } onLink={ this._onLink }/>
					</g>
				</g>
				<rect ref={ this._onMarqueeElement } className="marquee"/>
			</svg>
		);
	}
}

Graph.propTypes = Object.assign( {}, GraphBase.propTypes );

export default observer( Graph );