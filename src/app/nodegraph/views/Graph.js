import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
//import Physics from "../core/Physics";
import GraphModel from "../Graph";
import GridModel from "../../interface/Grid";
import Arrows from "./Arrows";
import Nodes from "./Nodes";
import Edges from "./Edges";
import "./Graph.css";

class Graph extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables;
		this._element = null;
		this._svgElement = null;
		this._viewElement = null;
		this._bgElement = null;
		this._bgGridElement = null;
		this._bgSmallGridElement = null;
		this._edges = null;
		
		// Events
		this._onTransformDispose = observe( tProps.model._transform, ( tChange ) => { this.onTransform( tChange ); } );
		this._onGridDispose = observe( tProps.grid, ( tChange ) => { this.onGrid( tChange ); } );
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
		this._onMouseMove = ( tEvent ) => { this.onMouseMove( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}

	componentDidMount()
	{
		// Initialize
		this.backgroundPosition = this.props.model._transform._position;
		this.backgroundScale = this.props.model._transform._scale.x;
		this.updateTransform();
		
		// Inputs
		this._element.addEventListener( "mousedown", this._onMouseDown );
	}
	
	componentWillUnmount()
	{
		this._onTransformDispose();
		this._onTransformDispose = null;
		this._onGridDispose();
		this._onGridDispose = null;
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
	
	onGrid( tChange )
	{
		if ( tChange.name === "size" )
		{
			this.backgroundScale = this.props.model._transform._scale.x;
		}
	}
	
	onTransform( tChange )
	{
		const tempIsPositionChange = tChange.name === "_position";
		if ( tempIsPositionChange || tChange.name === "_scale" )
		{
			if ( tempIsPositionChange )
			{
				this.backgroundPosition = tChange.newValue;
			}
			else
			{		
				this.backgroundScale = tChange.newValue.x;
			}
			
			this.updateTransform();
		}
	}
	
	set backgroundPosition( tVector )
	{
		this._bgGridElement.setAttribute( "x", tVector.x );
		this._bgGridElement.setAttribute( "y", tVector.y );
	}
	
	set backgroundScale( tScale )
	{
		let tempScale = tScale * this.props.grid.size;
		this._bgGridElement.setAttribute( "height", tempScale );
		this._bgGridElement.setAttribute( "width", tempScale );
		
		tempScale = tScale * 20;
		this._bgSmallGridElement.setAttribute( "height", tempScale );
		this._bgSmallGridElement.setAttribute( "width", tempScale );
	}
	
	updateTransform() 
	{
		const tempTransform = this.props.model._transform;
		this._viewElement.setAttribute( "transform", "translate(" + tempTransform._position.x + "," + tempTransform._position.y + ") scale(" + tempTransform._scale.x + ")" );
	}

	render() // TODO: Graph needs to be in World AND View transform
	{
		// TODO: Optimize so not re-rendering each time something changes
		return (
			<div className="graph" ref={ ( tElement ) => { this._element = tElement; } }>
				<svg ref={ ( tElement ) => { this._svgElement = tElement; } } height="100%" width="100%">
					<defs>
						<filter xmlns="http://www.w3.org/2000/svg" id="node-glow">
							<feGaussianBlur stdDeviation="6"/>
							<feComponentTransfer>
								<feFuncA type="linear" slope="0.35"/>
							</feComponentTransfer>
							<feMerge> 
								<feMergeNode/>
								<feMergeNode in="SourceGraphic"/> 
							</feMerge>
						</filter>
						<filter xmlns="http://www.w3.org/2000/svg" id="edge-glow">
							<feGaussianBlur stdDeviation="6"/>
							<feComponentTransfer>
								<feFuncA type="linear" slope="0.4"/>
							</feComponentTransfer>
							<feMerge> 
								<feMergeNode/>
								<feMergeNode in="SourceGraphic"/> 
							</feMerge>
						</filter>
						<pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse" ref={ ( tElement ) => { this._bgSmallGridElement = tElement; } }>
							<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4285b0" strokeWidth="0.5" strokeOpacity="0.25"/>
						</pattern>
						<pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse" ref={ ( tElement ) => { this._bgGridElement = tElement; } }>
							<rect width="100" height="100" fill="url(#smallGrid)"/>
							<path d="M 100 0 L 0 0 0 100" fill="none" stroke="#4285b0" strokeWidth="2" strokeOpacity="0.1"/>
						</pattern>
						<Arrows types={ this.props.model._edgeTypes }/>
					</defs>
					<rect className={ this.props.grid.isVisible ? "grid" : "grid hidden" } fill="url(#grid)" height="100%" width="100%"/>
					<g ref={ ( tElement ) => { this._viewElement = tElement; } }>
						<Edges ref={ ( tComponent ) => { this._edges = tComponent; } }/>
						<Nodes onLink={ ( tModel, tIsSet ) => { this._edges.onLink( tModel, tIsSet ); } } onSelectSingle={ ( tNode ) => { this.props.model._selection.selectSingleNode( tNode ); } } nodes={ this.props.model._nodes }/>
					</g>
				</svg>
			</div>
		);
	}
}

Graph.propTypes =
{
	model: PropTypes.instanceOf( GraphModel ).isRequired,
	grid: PropTypes.instanceOf( GridModel ).isRequired
};

export default observer( Graph );