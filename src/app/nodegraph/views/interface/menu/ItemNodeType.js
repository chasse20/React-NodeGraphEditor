import React from "react";
import PropTypes from "prop-types";
import Vector2D from "../../../../core/Vector2D";
import TypeModel from "../../../models/TypeNode";
import GraphModel from "../../../models/Graph";
import Item from "./Item";
import Icons from "../../Icons";
import Style from "./Item.module.css";

export default class ItemNodeType extends Item
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
	
	renderBar( tStyle = Style )
	{
		return (
			<React.Fragment>
				<span>{ this.props.model._name }</span>
				<div>
					<button className={ tStyle.button } onClick={ this._onSelect }>
						{ Icons.select }
					</button>
					<button className={ tStyle.button } onClick={ this._onAdd }>
						{ Icons.addNode }
					</button>
					<button className={ tStyle.button } onClick={ this._onDelete }>
						{ Icons.delete }
					</button>
				</div>
			</React.Fragment>
		);
	}
}

ItemNodeType.propTypes =
{
	model: PropTypes.instanceOf( TypeModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};