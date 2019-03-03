import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import Icons from "../../Icons";
import Style from "./Delete.module.css";

class Delete extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onDelete = () => { this.onDelete(); };
	}
	
	onDelete()
	{
		// Delete nodes
		const tempGraph = this.props.graph;
		let tempSelected = tempGraph._selectedNodes;
		for ( let tempID in tempSelected )
		{
			tempGraph.removeNode( tempSelected[ tempID ] );
		}
		
		// Delete edges
		tempSelected = tempGraph._selectedEdges;
		for ( let tempID in tempSelected )
		{
			let tempEdge = tempSelected[ tempID ];
			tempEdge._source.removeLink( tempEdge );
		}
	}
	
	render( tStyle = Style )
	{
		const tempGraph = this.props.graph;
		
		return (
			<button className={ tStyle.button } onMouseDown={ this._onDelete } disabled={ tempGraph._selectedNodesCount <= 0 && tempGraph._selectedEdgesCount <= 0 }>
				{ Icons.delete }
			</button>
		);
	}
}

Delete.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Delete );