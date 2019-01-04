import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
//import Physics from "../core/Physics";
import GraphModel from "../Graph";
import GridModel from "../../interface/Grid";
import Defs from "./Defs";
import Nodes from "./Nodes";
import Edges from "./Edges";
import "./Graph.css";

class Graph extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._svgElement = null;
		this._viewElement = null;
		this._edges = null;
		
		// Events
		this._onTransformDispose = observe( tProps.model._transform, ( tChange ) => { this.transform = tChange.object; } );
		this._onSVGElement = ( tElement ) => { this._svgElement = tElement; };
		this._onViewElement = ( tElement ) => { this._viewElement = tElement; };
		this._onEdges = ( tComponent ) => { this._edges = tComponent; };
		this._onLink = ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); };
	}

	componentDidMount()
	{
		this.setTransform = this.props.model._transform;
	}
	
	componentWillUnmount()
	{
		if ( this.props.model.isSelected )
		{
			this.props.onSelectGraph( null );
		}
		
		this._onTransformDispose();
		this._onTransformDispose = null;
	}

	set transform( tTransform )
	{
		this._viewElement.setAttribute( "transform", "translate(" + tTransform._position.x + "," + tTransform._position.y + ") scale(" + tTransform._scale.x + ")" );
	}

	render()
	{
		return (
			<div className={ this.props.model.isSelected ? "graph selected" : "graph" } onMouseDown={ this.props.onSelectGraph }>
				<svg ref={ this._onSVGElement } height="100%" width="100%">
					<Defs viewTransform={ this.props.model._transform } edgeTypes={ this.props.model._edgeTypes }/>
					<rect className={ this.props.grid.isVisible ? "grid" : "grid hidden" } fill="url(#grid)" height="100%" width="100%"/>
					<g ref={ this._onViewElement }>
						<Edges ref={ this._onEdges } onSelectEdge={ this.props.onSelectEdge }/>
						<Nodes nodes={ this.props.model._nodes } onLink={ this._onLink } onSelectNode={ this.props.onSelectNode }/>
					</g>
				</svg>
			</div>
		);
	}
}

Graph.propTypes =
{
	model: PropTypes.instanceOf( GraphModel ).isRequired,
	grid: PropTypes.instanceOf( GridModel ).isRequired,
	onSelectGraph: PropTypes.func.isRequired,
	onSelectNode: PropTypes.func.isRequired,
	onSelectEdge: PropTypes.func.isRequired
};

export default observer( Graph );