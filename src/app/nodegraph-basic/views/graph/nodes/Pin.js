import React from "react";
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
			this._onMouseDown = () => // TEMPORARY
			{
				const tempGraph = tProps.model._node._graph;
				const tempEdgeTypes = tempGraph._edgeTypes;
				for ( let tempKey in tempEdgeTypes )
				{
					let tempType = tempEdgeTypes[ tempKey ];
					let tempEdge = new tempType._modelClass( tempType, tempGraph.linkingPin, this.props.model );
					tempGraph.linkingPin.setLink( tempEdge );
					tempGraph.linkingPin = null;
					
					break;
				}
			};
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

Pin.propTypes = Object.assign( {}, PinBase.propTypes );

Pin.defaultProps = PinBase.defaultProps;

export default observer( Pin );