import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import PinModel from "../../../models/Pin";
import Style from "./Pin.module.css";

class Pin extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onLinksDispose = null;
		this._onMouseDown = null;
		if ( tProps.model._isOut )
		{
			this._onLinksDispose = observe( tProps.model._links, ( tChange ) => { this.onLinks( tChange ); } );
		}
		else
		{
			this._onMouseDown = () =>
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
	
	componentDidMount()
	{
		const tempModel = this.props.model;
		if ( tempModel._isOut )
		{
			const tempPins = tempModel._links;
			for ( let tempKey in tempPins )
			{
				this.props.onLink( tempPins[ tempKey ], true );
			}
		}
	}
	
	componentWillUnmount()
	{
		if ( this._onLinksDispose != null )
		{
			this._onLinksDispose();
			this._onLinksDispose = null;
		}
		
		const tempPins = this.props.model._links;
		for ( let tempKey in tempPins )
		{
			this.props.onLink( tempPins[ tempKey ] );
		}
	}
	
	onLinks( tChange )
	{
		if ( tChange.type === "add" )
		{
			this.props.onLink( tChange.newValue, true );
		}
		else if ( tChange.type === "remove" )
		{
			this.props.onLink( tChange.oldValue );
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

Pin.propTypes =
{
	model: PropTypes.instanceOf( PinModel ).isRequired,
	onLink: PropTypes.func.isRequired,
	radius: PropTypes.number
};

Pin.defaultProps =
{
	radius: 50
};

export default observer( Pin );