import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../models/Graph";
import InterfaceBase from "../../../nodegraph/views/interface/Interface";
import Controls from "./controls/Controls";
import Menu from "./menu/Menu";
import Style from "../../../nodegraph/views/interface/Interface.module.css";

export default class Interface extends InterfaceBase
{	
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.interface }`;
		if ( this.state.isOpen )
		{
			tempClass += ` ${ tStyle.open }`;
		}
		
		// Render
		return (
			<div className={ tempClass }>
				<Menu graph={ this.props.graph }/>
				<Controls graph={ this.props.graph } onMenuToggle={ this._onMenuToggle } isMenuOpen={ this.state.isOpen }/>
			</div>
		);
	}
}

Interface.propTypes = Object.assign(
	{},
	InterfaceBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);