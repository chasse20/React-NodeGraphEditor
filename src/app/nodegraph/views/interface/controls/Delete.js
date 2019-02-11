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
		// Clear from graph
		const tempNodes = this.props.graph._selectedNodes;
		for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
		{
			this.props.graph.removeNode( tempNodes[i] );
		}
	}
	
	render( tStyle = Style )
	{
		return (
			<button className={ tStyle.button } onMouseDown={ this._onDelete } disabled={ this.props.graph._selectedNodes.length <= 0 }>
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