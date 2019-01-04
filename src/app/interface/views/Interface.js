import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import InterfaceModel from "../Interface";
import Transform2DModel from "../../core/Transform2D";
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
	
	onSelectGraph( tEvent, tGraph )
	{
		this._selection.onSelectGraph( tEvent, tGraph );
	}
	
	onSelectNode( tEvent, tGraph )
	{
		this._selection.onSelectNode( tEvent, tGraph );
	}
	
	onSelectEdge( tEvent, tGraph )
	{
		this._selection.onSelectEdge( tEvent, tGraph );
	}
	
	render()
	{
		return (
			<div className="interface">
				<SideBar controls={ this.props.model._controls } menu={ this.props.model._menu } viewTransform={ this.props.viewTransform }/>
				<Selection ref={ this._onSelection } model={ this.props.model._controls._selection } viewTransform={ this.props.viewTransform }/>
			</div>
		);
	}
}

export default observer( Interface );

Interface.propTypes =
{
	model: PropTypes.instanceOf( InterfaceModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};