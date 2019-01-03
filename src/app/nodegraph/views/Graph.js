import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
//import Physics from "../core/Physics";
import GraphModel from "../Graph";
import GridModel from "../../interface/Grid";
import SelectionModel from "../../interface/Selection";
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
		
		// State
		this.state =
		{
			isGridVisible: true
		};
		
		// Variables;
		this._element = null;
		this._svgElement = null;
		this._viewElement = null;
		this._edges = null;
		
		// Events
		this._onTransformDispose = observe( tProps.model._transform, ( tChange ) => { this.transform = tChange.object; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onSVGElement = ( tElement ) => { this._svgElement = tElement; };
		this._onViewElement = ( tElement ) => { this._viewElement = tElement; };
		this._onEdges = ( tComponent ) => { this._edges = tComponent; };
		this._onLink = ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); };
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
		this._onMouseMove = ( tEvent ) => { this.onMouseMove( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}

	componentDidMount()
	{
		// Initialize
		this.setTransform = this.props.model._transform;
		
		// Inputs
		this._element.addEventListener( "mousedown", this._onMouseDown );
	}
	
	componentWillUnmount()
	{
		this._onTransformDispose();
		this._onTransformDispose = null;
	}
	
	set isGridVisible( tIsVisible )
	{
		this.setState( { isGridVisible: tIsVisible } );
	}

	onMouseDown( tEvent )
	{
		if ( tEvent.target === this._svgElement )
		{
			this.props.model._selection.clearSelectedNodes();
		}
		this.props.model._selection.startMove( tEvent );
		
		this._element.addEventListener( "mousemove", this._onMouseMove );
		this._element.addEventListener( "mouseup", this._onMouseUp );
		this._element.removeEventListener( "mousedown", this._onMouseDown );
	}
	
	onMouseUp( tEvent )
	{
		this._element.addEventListener( "mousedown", this._onMouseDown );
		this._element.removeEventListener( "mousemove", this._onMouseMove );
		this._element.removeEventListener( "mouseup", this._onMouseUp );
	}
	
	onMouseMove( tEvent )
	{
		this.props.model._selection.tryMove( tEvent );
	}

	set transform( tTransform )
	{
		console.log( "??" );
		this._viewElement.setAttribute( "transform", "translate(" + tTransform._position.x + "," + tTransform._position.y + ") scale(" + tTransform._scale.x + ")" );
	}

	render() // TODO: Graph needs to be in World AND View transform
	{
		// TODO: Optimize so not re-rendering each time something changes
		return (
			<div className="graph" ref={ this._onElement }>
				<svg ref={ this._onSVGElement } height="100%" width="100%">
					<Defs viewTransform={ this.props.model._transform } grid={ this.props.grid } edgeTypes={ this.props.model._edgeTypes }/>
					<rect className={ this.state.isGridVisible ? "grid" : "grid hidden" } fill="url(#grid)" height="100%" width="100%"/>
					<g ref={ this._onViewElement }>
						<Edges ref={ this._onEdges }/>
						<Nodes onLink={ this._onLink } selecion={ this.props.selection } nodes={ this.props.model._nodes }/>
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
	selection: PropTypes.instanceOf( SelectionModel ).isRequired
};

export default observer( Graph );