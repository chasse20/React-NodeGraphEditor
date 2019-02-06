import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Import from "../menu-sub-import/Import";
import Export from "../menu-sub-export/Export";
import Node from "../menu-sub-types-node/Node";
import Edge from "../menu-sub-types-edge/Edge";
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
			"graph"
		];
	}
	
	render()
	{
		return (
			<div className="menu">
				<div className="menu-inner">
					<div className="menu-tabs" >
						{
							this._tabs.map(
								( tTitle, tIndex ) =>
								(
									<button key={ tTitle } disabled={ tIndex === this.state.tab } style={ { width: ( 100 / this._tabs.length ) + "%" } } onMouseDown={ () => { this.setState( { tab: tIndex } ); } }>{ tTitle }</button>
								)
							)
						}
					</div>
					<div className="menu-content">
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
				return (
					<React.Fragment>
						<Node graph={ this.props.graph }/>
						<Edge graph={ this.props.graph }/>
					</React.Fragment>
				);
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