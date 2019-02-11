import React from "react";
import PropTypes from "prop-types";
import Vector2D from "../../../../core/Vector2D";
import TypeModel from "../../../models/TypeNode";
import GraphModel from "../../../models/Graph";
import Item from "../menu-item/Item";

export default class NodeType extends Item
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Events
		this._onSelect = () => { this.onSelect(); };
		this._onAdd = () => { this.onAdd(); };
		this._onDelete = () => { this.onDelete(); };
	}
	
	get specificClass()
	{
		return super.specificClass + " nodetype";
	}
	
	onSelect()
	{
		const tempGraph = this.props.graph;
		for ( let tempID in tempGraph._nodes )
		{
			let tempNode = tempGraph._nodes[ tempID ];
			if ( tempNode._type === this.props.model )
			{
				tempGraph.addSelectedNode( tempGraph._nodes[ tempID ] );
			}
		}
	}
	
	onAdd()
	{
		const tempGraph = this.props.graph;
		const tempNode = new this.props.model._modelClass( this.props.model );
		tempNode.position = new Vector2D( window.screen.width * 0.5, window.screen.height * 0.5 ).scale( 1 / tempGraph.zoom ).subtract( tempGraph.position )
		tempGraph.setNode( tempNode );
		
		return tempNode;
	}
	
	onDelete()
	{
		this.props.graph.removeNodeType( this.props.model );
	}
	
	renderBar()
	{
		return (
			<React.Fragment>
				<span>{ this.props.model._name }</span>
				<div className="item-buttons">
					<button onClick={ this._onSelect }>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
							<path d="M0,2h2V0C0.9,0,0,0.9,0,2z M0,10h2V8H0V10z M4,18h2v-2H4V18z M0,6h2V4H0V6z M10,0H8v2h2V0z M16,0v2h2 C18,0.9,17.1,0,16,0z M2,18v-2H0C0,17.1,0.9,18,2,18z M0,14h2v-2H0V14z M6,0H4v2h2V0z M8,18h2v-2H8V18z M16,10h2V8h-2V10z M16,18 c1.1,0,2-0.9,2-2h-2V18z M16,6h2V4h-2V6z M16,14h2v-2h-2V14z M12,18h2v-2h-2V18z M12,2h2V0h-2V2z M4,14h10V4H4V14z M6,6h6v6H6V6z"/>
						</svg>
					</button>
					<button onClick={ this._onAdd }>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
							<path d="M9.9,4.5H8.1v3.6H4.5v1.8h3.6v3.6h1.8V9.9h3.6V8.1H9.9V4.5z M9,0c-4.9,0-9,4-9,9s4,9,9,9s9-4,9-9S13.9,0,9,0z M9,16.2 C5,16.2,1.8,12.9,1.8,9S5,1.8,9,1.8S16.2,5,16.2,9S12.9,16.2,9,16.2z"/>
						</svg>
					</button>
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

NodeType.propTypes =
{
	model: PropTypes.instanceOf( TypeModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};