import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import GraphModel from "../../models/Graph";
import Vector2D from "../../../core/Vector2D";
import Style from "./Nodes.module.css";

export default class Nodes extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			nodes: null
		};
		
		// Variables
		this._nodes = null;
		this._nodesCount = 0;
		this._dragOffsets = null;
		
		// Events
		this._onNodesDispose = observe( tProps.graph._nodes, ( tChange ) => { this.onNodes( tChange ) } );
		this._onSelectedDispose = observe( tProps.graph._selectedNodes, ( tChange ) => { this.onSelected( tChange ) } );
		this._onDragStart = ( tEvent ) => { this.onDragStart( tEvent ); };
		this._onDragMove = ( tEvent ) => { this.onDragMove( tEvent ); };
		this._onDragUp = ( tEvent ) => { this.onDragUp( tEvent ); };
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
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
		
		// Selected state
		if ( tempGraph._selectedNodes.length > 0 )
		{
			document.addEventListener( "keydown", this._onKeyDown );
		}
	}
	
	componentWillUnmount()
	{
		// Clear events
		this._onNodesDispose();
		this._onNodesDispose = null;
		this._onSelectedDispose();
		this._onSelectedDispose = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragUp );
		document.removeEventListener( "keydown", this._onKeyDown );
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
		if ( tNodeView != null )
		{
			if ( this._nodesCount <= 0 )
			{
				this._nodes = {};
				this._nodesCount = 1;
			}
			else if ( this._nodes[ tNodeView.key ] === undefined )
			{
				++this._nodesCount;
			}
			
			this._nodes[ tNodeView.key ] = tNodeView;
			this.updateElements();
			
			return true;
		}
		
		return false;
	}
	
	removeNode( tID )
	{
		if ( this._nodesCount > 0 && this._nodes[ tID ] !== undefined )
		{
			delete this._nodes[ tID ];
			--this._nodesCount;
			
			if ( this._nodesCount <= 0 )
			{
				this._nodes = null;
				this._nodesCount = 0;
			}
			
			this.updateElements();
			
			return true;
		}
		
		return false;
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

		this.updateElements();
	}
	
	updateElements()
	{
		var tempElements = null;
		if ( this._nodesCount > 0 )
		{
			tempElements = [];
			
			const tempSelected = this.props.graph._selectedNodes;
			const tempLength = tempSelected.length;
			if ( tempLength === 0 )
			{
				for ( let tempID in this._nodes )
				{				
					tempElements.push( this._nodes[ tempID ] );
				}
			}
			else
			{
				// Selected nodes
				const tempAlreadySelected = {};
				const tempOffset = this._nodesCount - tempLength;
				tempElements.length = this._nodesCount;
				for ( let i = ( tempLength - 1 ); i >= 0; --i )
				{
					let tempID = tempSelected[i]._id;
					tempAlreadySelected[ tempID ] = true;
					tempElements[ tempOffset + i ] = this._nodes[ tempID ];
				}
				
				// Unselected
				var tempIndex = 0;
				for ( let tempID in this._nodes )
				{
					if ( tempAlreadySelected[ tempID ] === undefined )
					{
						tempElements[ tempIndex ] = this._nodes[ tempID ];
						++tempIndex;
					}
				}
			}
		}
		
		this.setState( { nodes: tempElements } );
	}
	
	onDragStart( tEvent )
	{
		const tempGraph = this.props.graph;
		const tempListLength = tempGraph._selectedNodes.length;
		if ( tempListLength > 0 )
		{
			const tempLocalStart = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempGraph.zoom ).subtract( tempGraph.position );
			
			this._dragOffsets = [];
			
			for ( let i = 0; i < tempListLength; ++i )
			{
				this._dragOffsets.push( Vector2D.Subtract( tempLocalStart, tempGraph._selectedNodes[i].position ) );
			}
		
			document.addEventListener( "mousemove", this._onDragMove );
			document.addEventListener( "mouseup", this._onDragUp );
		}
	}
	
	onDragMove( tEvent )
	{
		const tempGraph = this.props.graph;
		const tempLocalEnd = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempGraph.zoom ).subtract( tempGraph.position );
		
		// Grid snap
		const tempSelected = tempGraph._selectedNodes;
		if ( tempGraph.isGridSnap )
		{
			const tempGridSnap = tempGraph.gridSize / tempGraph.gridSnapIncrement;
			for ( let i = ( tempSelected.length - 1 ); i >= 0; --i )
			{
				let tempOffset = this._dragOffsets[i];
				tempSelected[i].position = new Vector2D( Math.round( ( tempLocalEnd.x - tempOffset.x ) / tempGridSnap ) * tempGridSnap, Math.round( ( tempLocalEnd.y - tempOffset.y ) / tempGridSnap ) * tempGridSnap );
			}
		}
		// No snap
		else
		{
			for ( let i = ( tempSelected.length - 1 ); i >= 0; --i )
			{
				tempSelected[i].position = Vector2D.Subtract( tempLocalEnd, this._dragOffsets[i] );
			}
		}
	}
	
	onDragUp( tEvent )
	{
		this._dragOffsets = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragUp );
	}
	
	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			const tempGraph = this.props.graph;
			const tempSelected = tempGraph._selectedNodes;
			for ( let i = ( tempSelected.length - 1 ); i >= 0; --i )
			{
				tempGraph.removeNode( tempSelected[i] );
			}
		}
	}

	render( tStyle = Style )
	{
		return (
			<g className={ tStyle.nodes }>
				{ this.state.nodes }
			</g>
		);
	}
}

Nodes.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	onLink: PropTypes.func.isRequired
};