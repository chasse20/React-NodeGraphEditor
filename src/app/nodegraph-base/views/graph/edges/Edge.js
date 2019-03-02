import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import EdgeModel from "../../../models/Edge";
import Style from "./Edge.module.css";

class Edge extends React.Component // TODO: Selectable
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._element = null;
		this._selectionElement = null;

		// Events
		this._onSourceMove = observe( tProps.model._source, "position", ( tChange ) => { this.sourcePosition = this.props.model._source.position; } );
		this._onTargetMove = observe( tProps.model._target, "position", ( tChange ) => { this.targetPosition = this.props.model._target.position; } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onSelectionElement = ( tElement ) => { this._selectionElement = tElement; };
		this._onMouseDown = ( tEvent ) => { this.onMouseDown( tEvent ); };
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
	
	onMouseDown( tEvent )
	{
		// Select
		if ( tEvent.button !== 1 ) // middle-mouse is reserved
		{
			const tempModel = this.props.model;
			if ( tempModel._isSelected )
			{
				tempModel._source._node._graph.removeSelectedEdge( tempModel );
			}
			else
			{
				tempModel._source._node._graph.setSelectedEdge( tempModel );
			}
		}
	}
	
	set sourcePosition( tVector )
	{
		this._element.setAttribute( "x1", tVector.x );
		this._element.setAttribute( "y1", tVector.y );
		
		this._selectionElement.setAttribute( "x1", tVector.x );
		this._selectionElement.setAttribute( "y1", tVector.y );
	}
	
	set targetPosition( tVector )
	{
		this._element.setAttribute( "x2", tVector.x );
		this._element.setAttribute( "y2", tVector.y );
		
		this._selectionElement.setAttribute( "x2", tVector.x );
		this._selectionElement.setAttribute( "y2", tVector.y );
	}
	
	render( tStyle = Style )
	{
		const tempModel = this.props.model;
		
		// Class
		var tempClass = `${ tStyle.edge }`;
		if ( tempModel._isSelected )
		{
			tempClass += ` ${ tStyle.selected }`;
		}
		
		// Render
		return (
			<g className={ tempClass }>
				<line className={ tStyle.selection } ref={ this._onSelectionElement } onMouseDown={ this._onMouseDown }/>
				<line className={ tStyle.line } ref={ this._onElement } stroke="#000000" markerEnd={ "url(#arrow-" + tempModel._type._name + ")" }/>
			</g>
		);
	}
}

Edge.propTypes =
{
	model: PropTypes.instanceOf( EdgeModel ).isRequired
};

export default observer( Edge );