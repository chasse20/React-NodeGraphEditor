import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import PinBase from "../../../../nodegraph/views/graph/nodes/Pin";
import Style from "./Pin.module.css";

class Pin extends PinBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onMouseDown = null;
		if ( !tProps.model._isOut )
		{
			this._onMouseDown = () => { this.props.onTarget( this.props.model ); };
		}
	}
	
	render( tStyle = Style )
	{
		const tempModel = this.props.model;
		if ( !tempModel._isOut )
		{
			const tempLinkingPin = tempModel._node._graph.linkingPin;
			if ( tempLinkingPin != null && tempLinkingPin._node !== tempModel._node )
			{
				return (
					<circle className={ tStyle.pin } cx="0" cy="0" r={ this.props.radius } onMouseDown={ this._onMouseDown }/>
				);
			}
		}
		
		return null;
	}
}

Pin.propTypes = Object.assign(
	{
		onTarget: PropTypes.func.isRequired
	},
	PinBase.propTypes
);

Pin.defaultProps = PinBase.defaultProps;

export default observer( Pin );