import React from "react";
import { observe } from "mobx";
import Style from "./Edges.module.css";

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
		
		// Events
		this._onSelectedDispose = observe( tProps.graph._selectedEdges, ( tChange ) => { this.onSelected( tChange ) } );
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
	}
	
	componentDidMount()
	{
		// Selected state
		if ( this.props.graph._selectedEdges.length > 0 )
		{
			document.addEventListener( "keydown", this._onKeyDown );
		}
	}
	
	componentWillUnmount()
	{
		// Clear events
		this._onSelectedDispose();
		this._onSelectedDispose = null;
		
		document.removeEventListener( "keydown", this._onKeyDown );
	}
	
	onSelected( tChange )
	{
		if ( tChange.addedCount > 0 && tChange.object.length === 1 )
		{
			document.addEventListener( "keydown", this._onKeyDown );
		}
		else if ( tChange.removedCount > 0 && tChange.object.length === 0 )
		{
			document.removeEventListener( "keydown", this._onKeyDown );
		}
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
	
	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			const tempGraph = this.props.graph;
			const tempSelected = tempGraph._selectedEdges;
			for ( let i = ( tempSelected.length - 1 ); i >= 0; --i )
			{
				let tempEdge = tempSelected[i];
				tempEdge._source.removeLink( tempEdge );
			}
		}
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
	
	render( tStyle = Style )
	{
		return (
			<g className={ tStyle.edges }>
				{ this.state.edges }
			</g>
		);
	}
}