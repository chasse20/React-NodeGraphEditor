import React from "react";
import "./Edges.css";

export default class Edges extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state =
		{
			edges: {}
		};
	}
	
	onLink( tModel, tIsSet )
	{
		var tempEdges = this.state.edges;
		if ( tIsSet )
		{
			const tempEdge = this.createElement( tModel );
			if ( tempEdge != null )
			{
				tempEdges[ tempEdge.id ] = tempEdge;
			}
		}
		else
		{
			delete tempEdges[ tModel.id ];
		}
		
		this.setState( { edges: tempEdges } ); // TODO: figure out how to optimize this so render isn't called each time
	}

	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel.id } );
	}
	
	render()
	{
		return (
			<g className="edges">
				{ Object.values( this.state.edges ) }
			</g>
		);
	}
}