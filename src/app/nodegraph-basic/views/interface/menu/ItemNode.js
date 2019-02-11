import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Item from "../../../../nodegraph/views/interface/menu/Item";
import IconsBase from "../../../../nodegraph/views/Icons";
import Style from "./ItemNode.module.css";

export default class ItemNode extends Item
{
	render( tStyle = Style )
	{
		return super.render( tStyle );
	}
	
	renderBar( tStyle = Style )
	{
		return (
			<button className={ tStyle.toggle } onClick={ this._onOpen }>
				{ IconsBase.arrow }
				<span>{ this.props.model._id + " : " + this.props.model.text }</span>
			</button>
		);
	}
	
	renderContent( tStyle = Style )
	{
		const tempModel = this.props.model;
		
		return null;
	}
}

ItemNode.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};