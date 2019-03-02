import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeEdge";
import Item from "./Item";
import IconsBase from "../../../../nodegraph-base/views/Icons";
import Icons from "../../Icons";
import Style from "./ItemEdgeType.module.css";

class ItemEdgeType extends Item
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onDelete = () => { this.onDelete(); };
		this._onVisible = () => { this.props.model.isVisible = !this.props.model.isVisible; };
		this._onStroke = ( tEvent ) => { this.props.model.stroke = tEvent.target.value; };
		this._onText = ( tEvent ) => { this.props.model.text = tEvent.target.value; };
	}
	
	onDelete()
	{
		this.props.graph.removeEdgeType( this.props.model );
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
					<div className={ tStyle.circle } style={ { borderColor: tempModel.stroke } }/>
					<span>{ tempModel._name }</span>
				</button>
				<div>
					<button className={ tempVisibleClass } onClick={ this._onVisible }>
						{ Icons.visible }
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
				<span>Stroke</span>
				<input type="color" value={ tempModel.stroke } onChange={ this._onStroke }/>
				<span>Text</span>
				<textarea value={ tempModel.text } onChange={ this._onText }/>
			</div>
		);
	}
}

ItemEdgeType.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	model: PropTypes.instanceOf( TypeModel ).isRequired
};

export default observer( ItemEdgeType );