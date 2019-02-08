import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import TypeModel from "../../../models/TypeEdge";
import EdgeTypeBase from "../../../../nodegraph/views/interface/menu-item-edgetype/EdgeType";
import "./EdgeType.css";

class EdgeType extends EdgeTypeBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state.isOpen = false;
		
		// Events
		this._onToggleVisible = () => { this.props.model.isVisible = !this.props.model.isVisible; };
		this._onStroke = ( tEvent ) => { this.props.model.stroke = tEvent.target.value; };
		this._onText = ( tEvent ) => { this.props.model.text = tEvent.target.value; };
	}
	
	renderBar()
	{
		const tempModel = this.props.model;
		
		return (
			<React.Fragment>
				<button className="item-toggle" onClick={ this._onStateToggle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24">
						<path d="M0,24l12-12L0,0V24z"/>
					</svg>
					<div className="circle" style={ { backgroundColor: tempModel.fill, borderColor: tempModel.stroke } }/>
					<span>{ tempModel._name }</span>
				</button>
				<div className="item-buttons">
					<button className={ tempModel.isVisible ? null : "deselected" } onClick={ this._onToggleVisible }>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 15">
							<path d="M10,1C5.5,1,1.6,3.7,0,7.5C1.6,11.3,5.5,14,10,14s8.4-2.7,10-6.5C18.4,3.7,14.5,1,10,1z M10,11.8 c-2.5,0-4.5-1.9-4.5-4.3s2-4.3,4.5-4.3s4.5,1.9,4.5,4.3S12.5,11.8,10,11.8z M10,4.9c-1.5,0-2.7,1.2-2.7,2.6s1.2,2.6,2.7,2.6 s2.7-1.2,2.7-2.6S11.5,4.9,10,4.9z"/>
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
	
	renderContent()
	{
		const tempModel = this.props.model;
		
		return (
			<div className="sub-kvp">
				<span>Stroke</span>
				<input type="color" value={ tempModel.stroke } onChange={ this._onStroke }/>
				<span>Text</span>
				<input type="text" value={ tempModel.text } onChange={ this._onText }/>
			</div>
		);
	}
}

EdgeType.propTypes = Object.assign(
	{},
	EdgeTypeBase.propTypes,
	{
		model: PropTypes.instanceOf( TypeModel ).isRequired
	}
);

export default observer( EdgeType );