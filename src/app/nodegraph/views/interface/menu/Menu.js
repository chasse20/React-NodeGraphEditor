import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Import from "../submenu-import/Import";
import Export from "../submenu-export/Export";
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
			"i/o",
			"graph",
			"data"
		];
	}
	
	render()
	{
		return (
			<div className="menu">
				<div className="inner">
					<div className="tabs" >
						{
							this._tabs.map(
								( tTitle, tIndex ) =>
								(
									<button key={ tTitle } disabled={ tIndex === this.state.tab } onMouseDown={ () => { this.setState( { tab: tIndex } ); } }>{ tTitle }</button>
								)
							)
						}
					</div>
					<div className="content">
						{ this.renderContent() }
					</div>
				</div>
			</div>
		);
	}
	
	renderContent()
	{
		switch ( this.state.tab )
		{
			case 0: // I/O
				return (
					<React.Fragment>
						<Import graph={ this.props.graph }/>
						<Export graph={ this.props.graph }/>
					</React.Fragment>
				);
			case 1: // Graph
				break;
				//return <Graph graph={ this.props.graph }/>
			case 2: // Data
				break;
				//return <Data graph={ this.props.graph }/>
			default:
				break;
		}
		
		return null;
	}
}

Menu.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};