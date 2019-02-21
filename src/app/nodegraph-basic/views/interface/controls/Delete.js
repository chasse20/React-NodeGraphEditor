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
		const tempNodes = tempGraph._selectedNodes;
		for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
		{
			tempGraph.removeNode( tempNodes[i] );
		}
		
		// Delete edges
		const tempEdges = tempGraph._selectedEdges;
		for ( let i = ( tempEdges.length - 1 ); i >= 0; --i )
		{
			let tempEdge = tempEdges[i];
			tempEdge._source.removeLink( tempEdge );
		}
	}
	
	render( tStyle = Style )
	{
		const tempGraph = this.props.graph;
		
		return (
			<button className={ tStyle.button } onMouseDown={ this._onDelete } disabled={ tempGraph._selectedNodes.length <= 0 && tempGraph._selectedEdges.length <= 0 }>
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