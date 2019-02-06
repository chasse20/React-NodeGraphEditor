import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import "./Delete.css";

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
	
	render()
	{
		return (
			<button className="delete" onMouseDown={ this._onDelete } disabled={ this.props.graph._selectedNodes.length <= 0 }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M4,21.3C4,22.8,5.2,24,6.7,24h10.7c1.5,0,2.7-1.2,2.7-2.7v-16H4V21.3z M7.3,11.8L9.2,10l2.8,2.8l2.8-2.8l1.9,1.9l-2.8,2.8 l2.8,2.8l-1.9,1.9L12,16.5l-2.8,2.8l-1.9-1.9l2.8-2.8L7.3,11.8z M16.7,1.3L15.3,0H8.7L7.3,1.3H2.7V4h18.7V1.3H16.7z"/>
				</svg>
			</button>
		);
	}
}

Delete.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Delete );