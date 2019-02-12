import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import TypeModel from "../../../models/TypeEdge";
import ItemEdgeTypeBase from "../../../../nodegraph/views/interface/menu/ItemEdgeType";
import IconsBase from "../../../../nodegraph/views/Icons";
import Icons from "../../Icons";
import Style from "./ItemNodeType.module.css";

class ItemEdgeType extends ItemEdgeTypeBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onVisible = () => { this.props.model.isVisible = !this.props.model.isVisible; };
		this._onStroke = ( tEvent ) => { this.props.model.stroke = tEvent.target.value; };
		this._onText = ( tEvent ) => { this.props.model.text = tEvent.target.value; };
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
					<div className={ tStyle.circle } style={ { borderColor: tempModel.stroke } }/>
					<span>{ tempModel._name }</span>
				</button>
				<div>
					<button className={ tempVisibleClass } onClick={ this._onVisible }>
						{ Icons.visible }
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
				<span>Stroke</span>
				<input type="color" value={ tempModel.stroke } onChange={ this._onStroke }/>
				<span>Text</span>
				<textarea onChange={ this._onText }>{ tempModel.text }</textarea>
			</div>
		);
	}
}

ItemEdgeType.propTypes = Object.assign(
	{},
	ItemEdgeTypeBase.propTypes,
	{
		model: PropTypes.instanceOf( TypeModel ).isRequired
	}
);

export default observer( ItemEdgeType );