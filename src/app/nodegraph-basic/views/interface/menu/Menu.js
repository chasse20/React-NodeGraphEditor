import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import MenuBase from "../../../../nodegraph/views/interface/menu/Menu";
import Import from "../menu-sub-import/Import";
import Export from "../menu-sub-export/Export";

export default class Menu extends MenuBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._tabs =
		[
			"i/o",
			"graph",
			"data"
		];
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
					</React.Fragment>
				);
			default:
				break;
		}
		
		return null;
	}
}

Menu.propTypes = Object.assign(
	{},
	MenuBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);