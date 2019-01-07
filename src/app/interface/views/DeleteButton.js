import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../nodegraph/Graph";
import SelectionModel from "../Selection";
import "./DeleteButton.css";

class DeleteButton extends React.Component
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
		const tempNodes = this.props.model._nodes;
		for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
		{
			this.props.graph.removeNode( tempNodes[i] );
		}
		
		// Clear from selection
		this.props.model.clearNodes();
	}
	
	
	
	render()
	{
		return (
			<button className={ this.props.model._nodes.length > 0 ? "delete selected" : "delete" } onMouseDown={ this._onDelete }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M4,21.3C4,22.8,5.2,24,6.7,24h10.7c1.5,0,2.7-1.2,2.7-2.7v-16H4V21.3z M7.3,11.8L9.2,10l2.8,2.8l2.8-2.8l1.9,1.9l-2.8,2.8 l2.8,2.8l-1.9,1.9L12,16.5l-2.8,2.8l-1.9-1.9l2.8-2.8L7.3,11.8z M16.7,1.3L15.3,0H8.7L7.3,1.3H2.7V4h18.7V1.3H16.7z"/>
				</svg>
			</button>
		);
	}
}

DeleteButton.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( DeleteButton );