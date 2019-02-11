import React from "react";
import Sub from "./Sub";
import Style from "./SubTypes.module.css";

export default class SubTypes extends Sub
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
	
	renderContent( tStyle = Style )
	{
		// Items
		const tempItems = this.renderItems();
		
		// Render
		return (
			<React.Fragment>
				{
					tempItems != null &&
						<div className={ tStyle.items }>
							{ tempItems }
						</div>
				}
				<div className={ tStyle.new }>
					<input type="text" value={ this.state.newKey } placeholder="Enter Type Name..." onChange={ this._onNewText }/>
					<button className={ tStyle.create } onClick={ this._onNew }>new type</button>
				</div>
			</React.Fragment>
		);
	}
	
	renderItems()
	{
		return null;
	}
}

SubTypes.propTypes = Object.assign(
	{},
	Sub.propTypes
);