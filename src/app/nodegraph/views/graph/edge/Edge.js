import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import EdgeModel from "../../../models/Edge";
import "./Edge.css";

class Edge extends React.Component // TODO: Selectable
{
	static SerializableClasses = { "default": Edge, "Edge": Edge };
	
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._element = null;

		// Events
		this._onSourceMove = observe( tProps.model._source, "position", ( tChange ) => { this.sourcePosition = this.props.model._source.position; } );
		this._onTargetMove = observe( tProps.model._target, "position", ( tChange ) => { this.targetPosition = this.props.model._target.position; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
	}

	componentDidMount()
	{
		this.sourcePosition = this.props.model._source.position;
		this.targetPosition = this.props.model._target.position;
	}
	
	componentWillUnmount()
	{
		this._onSourceMove();
		this._onSourceMove = null;
		this._onTargetMove();
		this._onTargetMove = null;
	}
	
	set sourcePosition( tVector )
	{
		this._element.setAttribute( "x1", tVector.x );
		this._element.setAttribute( "y1", tVector.y );
	}
	
	set targetPosition( tVector )
	{
		this._element.setAttribute( "x2", tVector.x );
		this._element.setAttribute( "y2", tVector.y );
	}
	
	render()
	{
		return (
			<g className={ "edge " + this.constructor.name + ( this.props.model.isSelected ? " selected" : "" ) }>
				<line ref={ this._onElement } strokeOpacity="0.6" markerEnd={ "url(#arrow-" + this.props.model._type._name + ")" }/>
			</g>
		);
	}
}

Edge.propTypes =
{
	model: PropTypes.instanceOf( EdgeModel ).isRequired
};

export default observer( Edge );