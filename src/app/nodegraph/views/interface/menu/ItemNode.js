import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import NodeModel from "../../../models/Node";
import Item from "./Item";
import Data from "./Data";
import IconsBase from "../../../../nodegraph-base/views/Icons";
import Style from "./ItemNode.module.css";

class ItemNode extends Item
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onText = ( tEvent ) => { this.props.model.text = tEvent.target.value; };
	}
	
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
		
		return (
			<React.Fragment>
				<div className={ tStyle.kvp }>
					<span>Text</span>
					<textarea value={ tempModel.text } onChange={ this._onText } disabled={ !this.props.isEditable }/>
				</div>
				<Data data={ tempModel.data } isEditable={ this.props.isEditable }/>
			</React.Fragment>
		);
	}
}

ItemNode.propTypes = Object.assign(
	{
		model: PropTypes.instanceOf( NodeModel ).isRequired
	},
	Item.propTypes
);

export default observer( ItemNode );