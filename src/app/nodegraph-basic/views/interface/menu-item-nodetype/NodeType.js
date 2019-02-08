import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import TypeModel from "../../../models/TypeNode";
import NodeTypeBase from "../../../../nodegraph/views/interface/menu-item-nodetype/NodeType";
import "./NodeType.css";

class NodeType extends NodeTypeBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state.isOpen = false;
		
		// Events
		this._onToggleVisible = () => { this.onToggleVisible(); };
		this._onRadius = ( tEvent ) => { this.props.model.radius = parseInt( tEvent.target.value ); };
		this._onFill = ( tEvent ) => { this.props.model.fill = tEvent.target.value; };
		this._onStroke = ( tEvent ) => { this.props.model.stroke = tEvent.target.value; };
	}
	
	onToggleVisible()
	{
		this.props.model.isVisible = !this.props.model.isVisible;
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
	
	renderContent()
	{
		const tempModel = this.props.model;
		
		return (
			<div className="sub-kvp">
				<span>Radius</span>
				<input type="number" value={ tempModel.radius } onChange={ this._onRadius }/>
				<span>Fill</span>
				<input type="color" value={ tempModel.fill } onChange={ this._onFill }/>
				<span>Stroke</span>
				<input type="color" value={ tempModel.stroke } onChange={ this._onStroke }/>
			</div>
		);
	}
}

NodeType.propTypes = Object.assign(
	{},
	NodeTypeBase.propTypes,
	{
		model: PropTypes.instanceOf( TypeModel ).isRequired
	}
);

export default observer( NodeType );