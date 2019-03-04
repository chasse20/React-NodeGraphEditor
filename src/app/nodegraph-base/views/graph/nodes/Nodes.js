import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import GraphModel from "../../../models/Graph";
import Vector2D from "../../../../core/Vector2D";
import Style from "./Nodes.module.css";

export default class Nodes extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._nodes = {};
		this._dragOffsets = null;
		
		// Events
		this._onNodesDispose = observe( tProps.graph._nodes, ( tChange ) => { this.onNodes( tChange ); } );
		this._onDragStart = ( tEvent ) => { this.onDragStart( tEvent ); };
		this._onDragMove = ( tEvent ) => { this.onDragMove( tEvent ); };
		this._onDragEnd = ( tEvent ) => { this.onDragEnd( tEvent ); };
	}
	
	componentDidMount()
	{
		// Initialize nodes
		const tempGraph = this.props.graph;
		const tempNodes = tempGraph._nodes;
		for ( let tempID in tempNodes )
		{
			this.setNode( this.createElement( tempNodes[ tempID ] ) );
		}
	}
	
	componentWillUnmount()
	{
		// Clear events
		this._onNodesDispose();
		this._onNodesDispose = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragEnd );
	}
	
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass,
			{
				model: tModel,
				key: tModel._id,
				onLink: this.props.onLink,
				onDragStart: this._onDragStart 
			}
		);
	}
	
	onNodes( tChange )
	{
		if ( tChange.type === "add" )
		{
			this.setNode( this.createElement( tChange.newValue ) );
		}
		else if ( tChange.type === "remove" )
		{
			this.removeNode( tChange.name );
		}
	}
	
	setNode( tNodeView )
	{
		if ( tNodeView != null && this._nodes[ tNodeView.key ] === undefined )
		{
			this._nodes[ tNodeView.key ] = tNodeView;
			
			this.forceUpdate();
			
			return true;
		}
		
		return false;
	}
	
	removeNode( tID )
	{
		if ( this._nodes[ tID ] !== undefined )
		{
			delete this._nodes[ tID ];
			
			this.forceUpdate();
			
			return true;
		}
		
		return false;
	}
	
	onDragStart( tEvent )
	{
		const tempGraph = this.props.graph;
		if ( tempGraph._selectedNodesCount > 0 )
		{
			const tempSelected = tempGraph._selectedNodes;
			const tempLocalStart = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempGraph.zoom ).subtract( tempGraph.position );
			
			this._dragOffsets = {};
			for ( let tempID in tempSelected )
			{
				this._dragOffsets[ tempID ] = Vector2D.Subtract( tempLocalStart, tempSelected[ tempID ].position );
			}
		
			document.addEventListener( "mousemove", this._onDragMove );
			document.addEventListener( "mouseup", this._onDragEnd );
		}
	}
	
	onDragMove( tEvent )
	{
		const tempGraph = this.props.graph;
		const tempSelected = tempGraph._selectedNodes;
		const tempLocalEnd = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempGraph.zoom ).subtract( tempGraph.position );
		
		// Grid snap
		if ( tempGraph.isGridSnap )
		{
			const tempGridSnap = tempGraph.gridSize / tempGraph.gridSnapIncrement;
			
			for ( let tempID in tempSelected )
			{
				let tempOffset = this._dragOffsets[ tempID ];
				tempSelected[ tempID ].position = new Vector2D( Math.round( ( tempLocalEnd.x - tempOffset.x ) / tempGridSnap ) * tempGridSnap, Math.round( ( tempLocalEnd.y - tempOffset.y ) / tempGridSnap ) * tempGridSnap );
			}
		}
		// No snap
		else
		{
			for ( let tempID in tempSelected )
			{
				tempSelected[ tempID ].position = Vector2D.Subtract( tempLocalEnd, this._dragOffsets[ tempID ] );
			}
		}
	}
	
	onDragEnd( tEvent )
	{
		this._dragOffsets = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragEnd );
	}

	render( tStyle = Style )
	{
		// Elements
		var tempElements = null;
		const tempGraph = this.props.graph;
		if ( tempGraph._selectedNodesCount > 0 ) // selected nodes get rendered last
		{
			tempElements = [];
			
			for ( let tempID in this._nodes )
			{
				if ( tempGraph._selectedNodes[ tempID ] === undefined )
				{
					tempElements.push( this._nodes[ tempID ] );
				}
			}
			
			for ( let tempID in tempGraph._selectedNodes )
			{
				tempElements.push( this._nodes[ tempID ] );
			}
		}
		else // render normally
		{
			for ( let tempID in this._nodes )
			{
				if ( tempElements === null )
				{
					tempElements = [];
				}
				
				tempElements.push( this._nodes[ tempID ] );
			}
		}
		
		// Render
		return (
			<g className={ tStyle.nodes }>
				{ tempElements }
			</g>
		);
	}
}

Nodes.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	onLink: PropTypes.func.isRequired
};