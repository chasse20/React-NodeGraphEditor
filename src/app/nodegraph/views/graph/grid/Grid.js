import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import GraphModel from "../../../Graph";
import "./Grid.css";

class Grid extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables;
		this._bgGridElement = null;
		
		// Events
		this._onZoomDispose = observe( this.props.graph, "zoom", ( tChange ) => { this.zoom = tChange.newValue; } );
		this._onPositionDispose = observe( this.props.graph, "position", ( tChange ) => { this.position = tChange.newValue; } );;
		this._onBGGridElement = ( tElement ) => { this._bgGridElement = tElement; };
	}

	componentDidMount()
	{
		this.zoom = this.props.graph.zoom;
		this.position = this.props.graph.position;
	}
	
	componentWillUnmount()
	{
		this._onZoomDispose();
		this._onZoomDispose = null;
		this._onPositionDispose();
		this._onPositionDispose = null;
	}
	
	set zoom( tAmount )
	{
		const tempPosition = this.props.graph.position;
		this._bgGridElement.setAttribute( "x", tAmount * tempPosition.x );
		this._bgGridElement.setAttribute( "y", tAmount * tempPosition.y );
		
		tAmount *= this.props.graph.gridSize;
		this._bgGridElement.setAttribute( "height", tAmount );
		this._bgGridElement.setAttribute( "width", tAmount );
	}

	set position( tPosition )
	{
		const tempZoom = this.props.graph.zoom;
		this._bgGridElement.setAttribute( "x", tPosition.x * tempZoom );
		this._bgGridElement.setAttribute( "y", tPosition.y * tempZoom );
	}

	render()
	{
		return (
			<React.Fragment>
				<defs>
					<pattern id="smallGrid" viewBox="0 0 20 20" width="20" height="20" patternUnits="userSpaceOnUse">
						<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4285b0" strokeWidth="0.5" strokeOpacity="0.75"/>
					</pattern>
					<pattern id="grid" width="100" viewBox="0 0 100 100" height="100" patternUnits="userSpaceOnUse" ref={ this._onBGGridElement }>
						<rect width="100" height="100" fill="url(#smallGrid)"/>
						<path d="M 100 0 L 0 0 0 100" fill="none" stroke="#4285b0" strokeWidth="2" strokeOpacity="0.6"/>
					</pattern>
				</defs>
				<rect className={ this.props.graph.isGridVisible ? "grid visible" : "grid" } fill="url(#grid)"/>
			</React.Fragment>
		);
	}
}

Grid.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Grid );