import React from "react";
import PropTypes from "prop-types";
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
				tempEdges[ tempEdge.key ] = tempEdge;
			}
		}
		else
		{
			delete tempEdges[ tModel.key ];
		}
		
		this.setState( { edges: tempEdges } ); // TODO: figure out how to optimize this so render isn't called each time
	}

	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel.key } );
	}
	
	render()
	{
		/*
		<defs>
					<filter xmlns="http://www.w3.org/2000/svg" id="node-glow">
						<feGaussianBlur stdDeviation="10"/>
						<feComponentTransfer>
							<feFuncA type="linear" slope="0.75"/>
						</feComponentTransfer>
						<feMerge> 
							<feMergeNode/>
							<feMergeNode in="SourceGraphic"/> 
						</feMerge>
					</filter>
				</defs>
		*/
		
		return (
			<g className="edges">
				{ Object.values( this.state.edges ) }
			</g>
		);
	}
}