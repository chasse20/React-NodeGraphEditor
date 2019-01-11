import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import Transform2DModel from "../../../../core/Transform2D";

class Marquee extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables;
		this._marqueeElement = null;
		
		// Events
		//this._onTransformDispose = observe( tProps.transform, ( tChange ) => { this.onTransform( tChange ); } );
		this._onMarqueeElement = ( tElement ) => { this._marqueeElement = tElement; };
	}

	componentDidMount()
	{
		
	}
	
	componentWillUnmount()
	{
		//this._onTransformDispose();
		//this._onTransformDispose = null;
	}

	render()
	{
		return (
			<rect ref={ this._onMarqueeElement } className={ this.props.isMarquee ? "marquee visible" : "marquee" }/>
		);
	}
}

Marquee.propTypes =
{
	transform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	isMarquee: PropTypes.bool.isRequired
};

Marquee.defaultProps =
{
	isMarquee: false
};

export default observer( Marquee );