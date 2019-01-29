import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import IO from "../menu-io/IO";
//import Graph from "../menu-graph/Graph";
//import Data from "../menu-data/Data";
import "./Menu.css";

export default class Menu extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			tab: 0
		};
		
		// Variables
		this._tabs =
		[
			"file",
			"graph",
			"data"
		];
	}
	
	render()
	{
		return (
			<div className="menu">
				<div className="tabs" >
					{
						this._tabs.map(
							( tTitle, tIndex ) =>
							(
								<button key={ tTitle } className={ tIndex === this.state.tab ? "selected" : null } onMouseDown={ () => { this.setState( { tab: tIndex } ); } }>{ tTitle }</button>
							)
						)
					}
				</div>
				<div className="content">
					{ this.renderContent() }
				</div>
			</div>
		);
	}
	
	renderContent()
	{
		switch ( this.state.tab )
		{
			case 1:
				//return <Graph graph={ this.props.graph }/>
			case 2:
				//return <Data graph={ this.props.graph }/>
			default:
				break;
		}
		
		return <IO graph={ this.props.graph }/>
	}
}

Menu.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};