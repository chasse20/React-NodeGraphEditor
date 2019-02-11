import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import TypeModel from "../../../models/TypeNode";
import ItemNodeTypeBase from "../../../../nodegraph/views/interface/menu/ItemNodeType";
import IconsBase from "../../../../nodegraph/views/Icons";
import Icons from "../../Icons";
import Style from "./ItemNodeType.module.css";

class ItemNodeType extends ItemNodeTypeBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onVisible = () => { this.props.model.isVisible = !this.props.model.isVisible; };
		this._onRadius = ( tEvent ) => { this.props.model.radius = parseInt( tEvent.target.value ); };
		this._onFill = ( tEvent ) => { this.props.model.fill = tEvent.target.value; };
		this._onStroke = ( tEvent ) => { this.props.model.stroke = tEvent.target.value; };
	}
	
	render( tStyle = Style )
	{
		return super.render( tStyle );
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
						{ IconsBase.select }
					</button>
					<button className={ tStyle.button } onClick={ this._onAdd }>
						{ IconsBase.addNode }
					</button>
					<button className={ tStyle.button } onClick={ this._onDelete }>
						{ IconsBase.delete }
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

ItemNodeType.propTypes = Object.assign(
	{},
	ItemNodeTypeBase.propTypes,
	{
		model: PropTypes.instanceOf( TypeModel ).isRequired
	}
);

export default observer( ItemNodeType );