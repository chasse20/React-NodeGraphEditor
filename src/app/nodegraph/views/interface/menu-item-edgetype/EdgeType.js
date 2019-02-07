import React from "react";
import PropTypes from "prop-types";
import TypeModel from "../../../models/TypeNode";
import GraphModel from "../../../models/Graph";
import Item from "../menu-item/Item";

export default class EdgeType extends Item
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
	
	renderBar()
	{
		return (
			<React.Fragment>
				<span>{ this.props.model._name }</span>
				<div className="item-buttons">
					<button className="item-delete" onClick={ this._onDelete }>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 18">
							<path d="M1,16c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V4H1V16z M3.5,8.9l1.4-1.4L7,9.6l2.1-2.1l1.4,1.4L8.4,11l2.1,2.1 l-1.4,1.4L7,12.4l-2.1,2.1l-1.4-1.4L5.6,11L3.5,8.9z M10.5,1l-1-1h-5l-1,1H0v2h14V1H10.5z"/>
						</svg>
					</button>
				</div>
			</React.Fragment>
		);
	}
}

EdgeType.propTypes =
{
	model: PropTypes.instanceOf( TypeModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};