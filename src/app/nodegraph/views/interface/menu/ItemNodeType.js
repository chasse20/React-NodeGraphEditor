import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Vector2D from "../../../../core/Vector2D";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeNode";
import Item from "./Item";
import IconsBase from "../../../../nodegraph-base/views/Icons";
import Icons from "../../Icons";
import Style from "./ItemNodeType.module.css";

class ItemNodeType extends Item
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onSelect = () => { this.onSelect(); };
		this._onAdd = () => { this.onAdd(); };
		this._onDelete = () => { this.onDelete(); };
		this._onVisible = () => { this.props.model.isVisible = !this.props.model.isVisible; };
		this._onRadius = ( tEvent ) => { this.props.model.radius = parseInt( tEvent.target.value ); };
		this._onFill = ( tEvent ) => { this.props.model.fill = tEvent.target.value; };
		this._onStroke = ( tEvent ) => { this.props.model.stroke = tEvent.target.value; };
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
		const tempNode = new this.props.model._modelClass( tempGraph, this.props.model );
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
		const tempModel = this.props.model;
		
		// Class
		var tempVisibleClass = `${ tStyle.button }`;
		if ( !tempModel.isVisible )
		{
			tempVisibleClass += ` ${ tStyle.invisible }`;
		}
		
		// Render
		return (
			<React.Fragment>
				<button className={ tStyle.toggle } onClick={ this._onOpen }>
					{ IconsBase.arrow }
					<div className={ tStyle.circle } style={ { backgroundColor: tempModel.fill, borderColor: tempModel.stroke } }/>
					<span>{ tempModel._name }</span>
				</button>
				<div>
					<button className={ tempVisibleClass } onClick={ this._onVisible }>
						{ Icons.visible }
					</button>
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
	
	renderContent( tStyle = Style )
	{
		const tempModel = this.props.model;
		
		return (
			<div className={ tStyle.kvp }>
				<span>Radius</span>
				<input type="number" value={ tempModel.radius } onChange={ this._onRadius }/>
				<span>Stroke</span>
				<input type="color" value={ tempModel.stroke } onChange={ this._onStroke }/>
				<span>Fill</span>
				<input type="color" value={ tempModel.fill } onChange={ this._onFill }/>
			</div>
		);
	}
}

ItemNodeType.propTypes =
{
	model: PropTypes.instanceOf( TypeModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( ItemNodeType );