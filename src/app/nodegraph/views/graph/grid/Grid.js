import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import Transform2DModel from "../../../../core/Transform2D";
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
		this._onTransformDispose = observe( tProps.transform, ( tChange ) => { this.onTransform( tChange ); } );
		this._onBGGridElement = ( tElement ) => { this._bgGridElement = tElement; };
	}

	componentDidMount()
	{
		this.scale = this.props.transform._scale;
		this.position = this.props.transform._position;
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
			this.position = tChange.newValue;
		}
		else if ( tChange.name === "_scale" )
		{
			this.scale = tChange.newValue;
		}
	}
	
	set scale( tScale )
	{
		const tempPosition = this.props.transform._position;
		this._bgGridElement.setAttribute( "x", tScale.x * tempPosition.x );
		this._bgGridElement.setAttribute( "y", tScale.y * tempPosition.y );
		this._bgGridElement.setAttribute( "height", tScale.x * this.props.size );
		this._bgGridElement.setAttribute( "width", tScale.y * this.props.size );
	}

	set position( tPosition )
	{
		const tempScale = this.props.transform._scale;
		this._bgGridElement.setAttribute( "x", tPosition.x * tempScale.x );
		this._bgGridElement.setAttribute( "y", tPosition.y * tempScale.y );
	}

	render()
	{
		return (
			<React.Fragment>
				<defs>
					<pattern id="smallGrid" viewBox="0 0 20 20" width="20" height="20" patternUnits="userSpaceOnUse">
						<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4285b0" strokeWidth="0.5" strokeOpacity="0.25"/>
					</pattern>
					<pattern id="grid" width="100" viewBox="0 0 100 100" height="100" patternUnits="userSpaceOnUse" ref={ this._onBGGridElement }>
						<rect width="100" height="100" fill="url(#smallGrid)"/>
						<path d="M 100 0 L 0 0 0 100" fill="none" stroke="#4285b0" strokeWidth="2" strokeOpacity="0.1"/>
					</pattern>
				</defs>
				<rect className={ this.props.isVisible ? "grid visible" : "grid" } fill="url(#grid)"/>
			</React.Fragment>
		);
	}
}

Grid.propTypes =
{
	size: PropTypes.number.isRequired,
	isVisible: PropTypes.bool.isRequired,
	transform: PropTypes.instanceOf( Transform2DModel ).isRequired
};

Grid.defaultProps =
{
	size: 80,
	isVisible: true
};

export default observer( Grid );