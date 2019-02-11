import React from "react";
import PropTypes from "prop-types";
import TypeModel from "../../../models/TypeEdge";
import GraphModel from "../../../models/Graph";
import Item from "./Item";
import Icons from "../../Icons";
import Style from "./Item.module.css";

export default class ItemEdgeType extends Item
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
		this.props.graph.removeEdgeType( this.props.model );
	}
	
	renderBar( tStyle = Style )
	{
		return (
			<React.Fragment>
				<span>{ this.props.model._name }</span>
				<div>
					<button className={ tStyle.button } onClick={ this._onDelete }>
						{ Icons.delete }
					</button>
				</div>
			</React.Fragment>
		);
	}
}

ItemEdgeType.propTypes =
{
	model: PropTypes.instanceOf( TypeModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};