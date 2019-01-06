import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
//import Physics from "../core/Physics";
import Transform2DModel from "../../core/Transform2D";
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
		this._viewElement = null;
		this._containerElement = null;
		this._edges = null;
		
		// Events
		this._onViewTransformDispose = observe( tProps.viewTransform, ( tChange ) => { this.viewTransform = tChange.object; } );
		this._onTransformDispose = observe( tProps.model._transform, ( tChange ) => { this.transform = tChange.object; } );
		this._onViewElement = ( tElement ) => { this._viewElement = tElement; };
		this._onContainerElement = ( tElement ) => { this._containerElement = tElement; };
		this._onEdges = ( tComponent ) => { this._edges = tComponent; };
		this._onLink = ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); };
	}

	componentDidMount()
	{
		this.viewTransform = this.props.viewTransform;
		this.transform = this.props.model._transform;
	}
	
	componentWillUnmount()
	{
		if ( this.props.model.isSelected )
		{
			this.props.onSelectGraph( null );
		}
		
		this._onViewTransformDispose();
		this._onViewTransformDispose = null;
		this._onTransformDispose();
		this._onTransformDispose = null;
	}
	
	set viewTransform( tTransform )
	{
		this._viewElement.setAttribute( "transform", "scale(" + tTransform._scale.x + ")" );
	}

	set transform( tTransform )
	{
		this._containerElement.setAttribute( "transform", "translate(" + tTransform._position.x + "," + tTransform._position.y + ")" );
	}

	render()
	{
		return (
			<div className={ this.props.model.isSelected ? "graph selected" : "graph" } onMouseDown={ this.props.onSelectGraph }>
				<svg ref={ this._onSVGElement } height="100%" width="100%">
					<Defs grid={ this.props.grid } viewTransform={ this.props.viewTransform } transform={ this.props.model._transform } edgeTypes={ this.props.model._edgeTypes }/>
					<rect className={ this.props.grid.isVisible ? "grid" : "grid hidden" } fill="url(#grid)" height="100%" width="100%"/>
					<g ref={ this._onViewElement }>
						<g ref={ this._onContainerElement }>
							<Edges ref={ this._onEdges } onSelectEdge={ this.props.onSelectEdge }/>
							<Nodes nodes={ this.props.model._nodes } onLink={ this._onLink } onSelectNode={ this.props.onSelectNode }/>
						</g>
					</g>
				</svg>
			</div>
		);
	}
}

Graph.propTypes =
{
	model: PropTypes.instanceOf( GraphModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	grid: PropTypes.instanceOf( GridModel ).isRequired,
	onSelectGraph: PropTypes.func.isRequired,
	onSelectNode: PropTypes.func.isRequired,
	onSelectEdge: PropTypes.func.isRequired
};

export default observer( Graph );