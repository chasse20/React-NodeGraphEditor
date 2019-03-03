import PropTypes from "prop-types";
import { observe } from "mobx";
import GraphModel from "../../../models/Graph";
import EdgesBase from "../../../../nodegraph-base/views/graph/edges/Edges";

export default class Edges extends EdgesBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Events
		this._onSelectedDispose = observe( tProps.graph, "_selectedEdgesCount", ( tChange ) => { this.onSelectedCount( tChange ); } );
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
	}
	
	componentDidMount()
	{
		// Selected state
		if ( this.props.graph._selectedEdgesCount > 0 )
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
	
	onSelectedCount( tChange )
	{
		if ( tChange.newValue === 0 )
		{
			document.removeEventListener( "keydown", this._onKeyDown );
		}
		else if ( tChange.newValue === 1 )
		{
			document.addEventListener( "keydown", this._onKeyDown );
		}
	}

	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			const tempGraph = this.props.graph;
			const tempSelected = tempGraph._selectedEdges;
			for ( let tempID in tempSelected )
			{			
				let tempEdge = tempSelected[ tempID ];
				tempEdge._source.removeLink( tempEdge );
			}
		}
	}
}

Edges.propTypes = Object.assign(
	{},
	EdgesBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);