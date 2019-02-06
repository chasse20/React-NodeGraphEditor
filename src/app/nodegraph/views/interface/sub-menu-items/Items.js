import React from "react";
import SubMenu from "../sub-menu/SubMenu";
import "./Items.css";

export default class Items extends SubMenu
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state.newKey = "";
		
		// Events
		this._onNewText = ( tEvent ) => { this.setState( { newKey: tEvent.target.value } ); };
		this._onNew = () => { this.onNew(); };
	}
	
	onNew()
	{
	}
	
	get specificClass()
	{
		return " items";
	}
	
	renderContent()
	{
		return (
			<div className="new">
				<input type="text" value={ this.newKey } placeholder="Enter Type Name..." onChange={ this._onNewText }/>
				<button onClick={ this._onNew }>new type</button>
			</div>
		);
	}
}