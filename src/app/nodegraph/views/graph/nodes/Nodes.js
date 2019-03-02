import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import NodesBase from "../../../../nodegraph-base/views/graph/nodes/Nodes";

export default class Nodes extends NodesBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Events
		this._onSelectedCountDispose = observe( tProps.graph, "_selectedNodesCount", ( tChange ) => { this.onSelectedCount( tChange ); } );
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
	}
	
	componentDidMount()
	{
		// Inheritance
		super.componentWillUnmount();
		
		// Selected state
		if ( tempGraph._selectedNodesCount > 0 )
		{
			document.addEventListener( "keydown", this._onKeyDown );
		}
	}
	
	componentWillUnmount()
	{
		// Inheritance
		super.componentWillUnmount();
		
		// Clear events
		this._onSelectedCountDispose();
		this._onSelectedCountDispose = null;
		
		document.removeEventListener( "keydown", this._onKeyDown );
	}
	
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass,
			{
				model: tModel,
				key: tModel._id,
				onLink: this.props.onLink,
				onTargetPin: this.props.onTargetPin,
				onDragStart: this._onDragStart 
			}
		);
	}
	
	onSelectedCount( tChange )
	{
		console.log( tChange );
		/*if ( tChange.addedCount > 0 && tChange.object.length === 1 )
		{
			document.addEventListener( "keydown", this._onKeyDown );
		}
		else if ( tChange.removedCount > 0 && tChange.object.length === 0 )
		{
			document.removeEventListener( "keydown", this._onKeyDown );
		}*/
	}
	
	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			const tempGraph = this.props.graph;
			for ( let tempID in tempGraph._selectedNodes )
			{
				tempGraph.removeNode( tempGraph._selectedNodes[ tempID ] );
			}
		}
	}
}

Nodes.propTypes = Object.assign(
	{
		onTargetPin: PropTypes.func.isRequired
	},
	NodesBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);