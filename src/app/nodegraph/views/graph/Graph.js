import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import GraphModel from "../../Graph";
import Nodes from "./nodes/Nodes";
import Edges from "./edges/Edges";
import Grid from "./grid/Grid";
import Marquee from "./marquee/Marquee";
import Arrows from "./arrows/Arrows";
import "./Graph.css";

class Graph extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._viewElement = null;
		this._nodes = null;
		this._edges = null;
		
		// Events
		this._onTransformDispose = observe( this.props.data._transform, ( tChange ) => { this.viewTransform =  tChange.object; } );
		this._onViewElement = ( tElement ) => { this._viewElement = tElement; };
		this._onNodes = ( tComponent ) => { this._nodes = tComponent; };
		this._onEdges = ( tComponent ) => { this._edges = tComponent; };
		this._onLink = ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); };
	}

	componentDidMount()
	{
		this.viewTransform = this.props.data._transform;
	}
	
	componentWillUnmount()
	{
		this._onTransformDispose();
		this._onTransformDispose = null;
	}
	
	set viewTransform( tTransform )
	{
		this._viewElement.setAttribute( "transform", "translate(" + tTransform._position.x + "," + tTransform._position.y + ") scale(" + tTransform._scale.x + ")" );
	}
	
	// PAN
	// MARQUEE IN THE RENDER, CALLBACK GOES TO NODES

	render()
	{
		console.log( "RENDERED" );
		return (
			<div className={ this.props.data.isPanning ? "graph panning" : "graph" }>
				<svg height="100%" width="100%">
					<Arrows types={ this.props.data._edgeTypes }/>
					<Grid transform={ this.props.data._transform } isVisible={ this.props.data.isVisible }/>
					<g ref={ this._onViewElement }>
						<Edges ref={ this._onEdges }/>
						<Nodes ref={ this._onNodes } nodes={ this.props.data._nodes } onLink={ this._onLink }/>
					</g>
					<Marquee ref={ this._onMarquee } transform={ this.props.data._transform } isMarquee={ this.props.data.isMarquee }/>
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