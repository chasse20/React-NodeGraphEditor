import React from "react";
import PropTypes from "prop-types";
import TypeModel from "../../../models/TypeNode";
import GraphModel from "../../../models/Graph";
import Item from "../menu-item/Item";
import "./NodeType.css";

export default class NodeType extends Item
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Events
		this._onDelete = () => { this.onDelete(); };
	}
	
	onDelete()
	{
		this.props.graph.removeNodeType( this.props.model );
	}
	
	renderContent()
	{
		return (
			<div className="item-bar" disabled>
				<div>{ this.props.model._name }</div>
				<div className="item-buttons">
					<button>ERR</button>
				</div>
			</button>
		);
	}
}

NodeType.propTypes =
{
	model: PropTypes.instanceOf( TypeModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};