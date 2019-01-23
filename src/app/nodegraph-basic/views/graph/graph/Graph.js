import React from "react";
import { observer } from "mobx-react";
import GraphBase from "../../../../nodegraph/views/graph/graph/Graph";
import Nodes from "../nodes/Nodes";
import Edges from "../edges/Edges";
import Grid from "../../../../nodegraph/views/graph/grid/Grid";
import Arrows from "../arrows/Arrows";
import Physics from "../physics/Physics";

class Graph extends GraphBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._physics = null;
		
		// Events
		this._onPhysics = ( tComponent ) => { this._physics = tComponent; };
		this._onNodePhysics = ( tNode, tIsAdded ) => { this._physics.onNodePhysics( tNode, tIsAdded ); };
		this._onEdgePhysics = ( tEdge, tIsAdded ) => { this._physics.onEdgePhysics( tEdge, tIsAdded ); };
	}
	
	render()
	{
		// Class
		var tempClass = "graph";
		if ( this.props.model.isPanning )
		{
			tempClass += " panning";
		}
		
		if ( this.props.model.isMarqueeing )
		{
			tempClass += " marqueeing";
		}
		
		// Render
		return (
			<React.Fragment>
				<Physics ref={ this._onPhysics } graph={ this.props.model }/>
				<svg className={ tempClass } onWheel={ this._onMouseWheel } onMouseDown={ this._onMouseDown }>
					<Arrows types={ this.props.model._edgeTypes }/>
					<Grid isVisible={ this.props.isGridVisible } offset={ this.props.model.position } zoom={ this.props.model.zoom }/>
					<g ref={ this._onViewElement }>
						<g ref={ this._onContainerElement }>
							<Edges ref={ this._onEdges } onPhysics={ this._onEdgePhysics }/>
							<Nodes ref={ this._onNodes } nodes={ this.props.model._nodes } selected={ this.props.model._selectedNodes } onLink={ this._onLink } onSelectNode={ this._onSelectNode } onRemoveNode={ this._onRemoveNode } position={ this.props.model.position } zoom={ this.props.model.zoom } isGridSnap={ this.props.isGridSnap } onPhysics={ this._onNodePhysics }/>
						</g>
					</g>
					<rect ref={ this._onMarqueeElement } className="marquee"/>
				</svg>
			</React.Fragment>
		);
	}
}

export default observer( Graph );