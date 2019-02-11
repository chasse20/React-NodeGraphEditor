import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import MenuBase from "../../../../nodegraph/views/interface/menu/Menu";
import SubImport from "./SubImport";
import SubExport from "./SubExport";
import SubTypesNode from "./SubTypesNode";
import SubTypesEdge from "./SubTypesEdge";
import SubDataNode from "./SubDataNode";

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
						<SubImport graph={ this.props.graph }/>
						<SubExport graph={ this.props.graph }/>
					</React.Fragment>
				);
			case 1: // Graph
				return (
					<React.Fragment>
						<SubTypesNode graph={ this.props.graph }/>
						<SubTypesEdge graph={ this.props.graph }/>
					</React.Fragment>
				);
			case 2: // Data
				return (
					<SubDataNode graph={ this.props.graph }/>
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