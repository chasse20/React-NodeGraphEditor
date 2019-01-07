import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Transform2DModel from "../../core/Transform2D";
import InterfaceModel from "../Interface";
import GraphModel from "../../nodegraph/Graph";
import SideBar from "./SideBar";
import Selection from "./Selection";
import "./Interface.css";

class Interface extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._selection = null;
		
		// Events
		this._onSelection = ( tComponent ) => { this._selection = tComponent; };
	}
	
	onSelectGraph( tEvent )
	{
		if ( tEvent != null )
		{
			tEvent.stopPropagation();
		}
		
		this._selection.onSelectGraph( tEvent );
	}
	
	onSelectNode( tEvent, tNode )
	{
		if ( tEvent != null )
		{
			tEvent.stopPropagation();
		}
		
		this._selection.onSelectNode( tEvent, tNode );
	}
	
	onSelectEdge( tEvent, tEdge )
	{
		if ( tEvent != null )
		{
			tEvent.stopPropagation();
		}
		
		this._selection.onSelectEdge( tEvent, tEdge );
	}
	
	render()
	{
		return (
			<div className="interface">
				<SideBar controls={ this.props.model._controls } menu={ this.props.model._menu } viewTransform={ this.props.viewTransform }/>
				<Selection ref={ this._onSelection } model={ this.props.model._controls._selection } viewTransform={ this.props.viewTransform } grid={ this.props.model._controls._grid } graph={ this.props.graph }/>
			</div>
		);
	}
}

export default observer( Interface );

Interface.propTypes =
{
	model: PropTypes.instanceOf( InterfaceModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};