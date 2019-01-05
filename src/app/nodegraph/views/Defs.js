import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import GridModel from "../../interface/Grid";
import Transform2DModel from "../../core/Transform2D";
import TypeModel from "../Type";
import Arrows from "./Arrows";

class Defs extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables;
		this._bgGridElement = null;
		this._bgSmallGridElement = null;
		
		// Events
		this._onTransformDispose = observe( tProps.viewTransform, ( tChange ) => { this.onTransform( tChange ); } );
		this._onBGGridElement = ( tElement ) => { this._bgGridElement = tElement; };
	}

	componentDidMount()
	{
		this.backgroundPosition = this.props.viewTransform._position;
		this.backgroundScale = this.props.viewTransform._scale.x;
	}
	
	componentWillUnmount()
	{
		this._onTransformDispose();
		this._onTransformDispose = null;
	}
	
	onTransform( tChange )
	{
		if ( tChange.name === "_position" )
		{
			this.backgroundPosition = tChange.newValue;
		}
		else if ( tChange.name === "_scale" )
		{		
			this.backgroundScale = tChange.newValue.x;
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
	}

	render() // TODO: Graph needs to be in World AND View transform
	{
		return (
			<defs>
				<filter xmlns="http://www.w3.org/2000/svg" id="node-glow">
					<feGaussianBlur stdDeviation="10"/>
					<feComponentTransfer>
						<feFuncA type="linear" slope="0.75"/>
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
				<pattern id="smallGrid" viewBox="0 0 20 20" width="20" height="20" patternUnits="userSpaceOnUse">
					<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4285b0" strokeWidth="0.5" strokeOpacity="0.25"/>
				</pattern>
				<pattern id="grid" width="100" viewBox="0 0 100 100" height="100" patternUnits="userSpaceOnUse" ref={ this._onBGGridElement }>
					<rect width="100" height="100" fill="url(#smallGrid)"/>
					<path d="M 100 0 L 0 0 0 100" fill="none" stroke="#4285b0" strokeWidth="2" strokeOpacity="0.1"/>
				</pattern>
				<Arrows types={ this.props.edgeTypes }/>
			</defs>
		);
	}
}

Defs.propTypes =
{
	grid: PropTypes.instanceOf( GridModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	edgeTypes: PropTypes.objectOf( PropTypes.instanceOf( TypeModel ) ).isRequired
};

export default observer( Defs );