import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import Transform2DModel from "../../core/Transform2D";
import GraphModel from "../Graph";
import PhysicsModel from "../../interface/Physics";
import GridModel from "../../interface/Grid";
import Defs from "./Defs";
import Nodes from "./Nodes";
import Edges from "./Edges";
import Physics from "./Physics"; // TODO: Hack
import "./Graph.css";

class Graph extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._physics = null;
		this._viewElement = null;
		this._containerElement = null;
		this._edges = null;
		
		// Events
		this._onViewTransformDispose = observe( tProps.viewTransform, "_scale", ( tChange ) => { this.scale = tChange.newValue; } );
		this._onTransformDispose = observe( tProps.model._transform, "_position", ( tChange ) => { this.position = tChange.newValue; } );
		this._onPhysics = ( tComponent ) => { this._physics = tComponent; };
		this._onNodePhysics = ( tNode, tIsAdded ) => { this._physics.onNodePhysics( tNode, tIsAdded ); };
		this._onEdgePhysics = ( tEdge, tIsAdded ) => { this._physics.onEdgePhysics( tEdge, tIsAdded ); };
		this._onViewElement = ( tElement ) => { this._viewElement = tElement; };
		this._onContainerElement = ( tElement ) => { this._containerElement = tElement; };
		this._onEdges = ( tComponent ) => { this._edges = tComponent; };
		this._onLink = ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); };
		this._onMouseDown = ( tEvent ) => { this.props.onSelectGraph( tEvent, this.props.model ); };
	}

	componentDidMount()
	{
		this.scale = this.props.viewTransform._scale;
		this.position = this.props.model._transform._position;
	}
	
	componentWillUnmount()
	{
		if ( this.props.model.isSelected )
		{
			this.props.onSelectGraph( null, this.props.model );
		}
		
		this._onViewTransformDispose();
		this._onViewTransformDispose = null;
		this._onTransformDispose();
		this._onTransformDispose = null;
	}
	
	set scale( tScale )
	{
		this._viewElement.setAttribute( "transform", "scale(" + tScale.x + ")" );
	}

	set position( tPosition )
	{
		this._containerElement.setAttribute( "transform", "translate(" + tPosition.x + "," + tPosition.y + ")" );
	}
	
	// PAN
	// MARQUEE IN THE RENDER, CALLBACK GOES TO NODES

	render()
	{
		return (
			<div className={ this.props.model.isPanning ? "graph panning" : "graph" } onMouseDown={ this._onMouseDown }>
				<svg height="100%" width="100%">
					<Defs transform={ this.props.data._transform }/>
					<rect className={ this.props.data.isGridVisible ? "grid visible" : "grid" } fill="url(#grid)"/>
					<g ref={ this._onViewElement }>
						<Edges ref={ this._onEdges }/>
						<Nodes ref={ this._onNodes } nodes={ this.props.model._nodes } onLink={ this._onLink }/>
					</g>
					<Marquee ref={ this._onMarquee } transform={ this.props.data._transform }/>
				</svg>
			</div>
		);
	}
}

Graph.propTypes =
{
	data: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Graph );