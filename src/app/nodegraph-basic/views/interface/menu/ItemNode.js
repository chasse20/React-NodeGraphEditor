import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import NodeModel from "../../../models/Node";
import Item from "../../../../nodegraph/views/interface/menu/Item";
import Data from "./Data";
import IconsBase from "../../../../nodegraph/views/Icons";
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
					<textarea onChange={ this._onText }>{ tempModel.text }</textarea>
				</div>
				<Data data={ tempModel.data }/>
			</React.Fragment>
		);
	}
}

ItemNode.propTypes =
{
	model: PropTypes.instanceOf( NodeModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( ItemNode );