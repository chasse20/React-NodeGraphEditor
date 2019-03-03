import React from "react";
import Style from "./Edges.module.css";

export default class Edges extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._edges = {};
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
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel.id } );
	}
	
	setEdge( tEdgeView )
	{
		if ( tEdgeView != null && this._edges[ tEdgeView.key ] === undefined )
		{
			this._edges[ tEdgeView.key ] = tEdgeView;
			
			this.forceUpdate();
			
			return true;
		}
		
		return false;
	}
	
	removeEdge( tID )
	{
		if ( this._edges[ tID ] !== undefined )
		{
			delete this._edges[ tID ];
			
			this.forceUpdate();
			
			return true;
		}
		
		return false;
	}
	
	render( tStyle = Style )
	{
		return (
			<g className={ tStyle.edges }>
				{ Object.values( this._edges ) }
			</g>
		);
	}
}