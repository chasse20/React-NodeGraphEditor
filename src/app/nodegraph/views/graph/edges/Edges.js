import React from "react";
import Edge from "../edge/Edge";
import "./Edges.css";

export default class Edges extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state =
		{
			edges: null
		};
		
		// Variables
		this._edges = null;
		this._edgesCount = 0;
	}

	onLink( tModel, tIsSet )
	{
		if ( tIsSet )
		{
			this.setEdge( this.createElement( tModel ) );
		}
		else
		{
			this.removeEdge( tModel.id );
		}
	}
	
	createElement( tModel )
	{
		var tempViewClass = tModel._type._viewClass;
		if ( tempViewClass == null )
		{
			tempViewClass = Edge;
		}
		
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel.id } );
	}
	
	setEdge( tEdgeView )
	{
		if ( tEdgeView != null )
		{
			if ( this._edgesCount <= 0 )
			{
				this._edgesCount = 1;
				this._edges = {};
				this._edges[ tEdgeView.key ] = tEdgeView;
				
				this.setState( { edges: Object.values( this._edges ) } );
				
				return true;
			}
			else if ( this._edges[ tEdgeView.key ] === undefined )
			{
				this._edges[ tEdgeView.key ] = tEdgeView;
				++this._edgesCount;
				
				this.setState( { edges: Object.values( this._edges ) } );
				
				return true;
			}
		}
		
		return false;
	}
	
	removeEdge( tID )
	{
		if ( this._edgesCount > 0 && this._edges[ tID ] !== undefined )
		{
			delete this._edges[ tID ];
			
			--this._edgesCount;
			if ( this._edgesCount <= 0 )
			{
				this._edgesCount = 0;
				this._edges = null;
				
				this.setState( { edges: null } );
			}
			else
			{
				this.setState( { edges: Object.values( this._edges ) } );
			}
			
			return true;
		}
		
		return false;
	}
	
	render()
	{
		return (
			<g className="edges">
				{ this.state.edges }
			</g>
		);
	}
}