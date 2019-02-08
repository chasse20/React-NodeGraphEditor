import React from "react";
import Sub from "../menu-sub/Sub";
import "./Types.css";

export default class Types extends Sub
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
		return super.specificClass + " types";
	}
	
	renderContent()
	{
		// Items
		const tempItems = this.renderItems();
		
		// Render
		return (
			<React.Fragment>
				{
					tempItems != null &&
						<div className="types-items">
							{ tempItems }
						</div>
				}
				<div className="types-new">
					<input type="text" value={ this.newKey } placeholder="Enter Type Name..." onChange={ this._onNewText }/>
					<button onClick={ this._onNew }>new type</button>
				</div>
			</React.Fragment>
		);
	}
	
	renderItems()
	{
		return null;
	}
}

Types.propTypes = Object.assign(
	{},
	Sub.propTypes
);