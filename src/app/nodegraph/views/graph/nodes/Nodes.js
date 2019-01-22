import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import Bounds from "../../../../core/Bounds";
import Vector2D from "../../../../core/Vector2D";
import NodeModel from "../../../models/Node";
import "./Nodes.css";

export default class Nodes extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			selected: {},
			nodes: {} // all node elements
		};
		
		// Variables
		this._selectedCount = 0;
		this._dragOffsets = null;
		
		// Events
		this._onNodesDispose = observe( tProps.nodes, ( tChange ) => { this.onNodes( tChange ); } );
		this._onNodeSelected = ( tNode ) =>
		{
			if ( tNode.isSelected )
			{
				this.setSelected( tNode );
			}
			else
			{
				this.removeSelected( tNode );
			}
		};
		this._onDragStart = ( tEvent ) => { this.onDragStart( tEvent ); };
		this._onDragMove = ( tEvent ) => { this.onDragMove( tEvent ); };
		this._onDragUp = ( tEvent ) => { this.onDragUp( tEvent ); };
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
	}
	
	componentDidMount()
	{
		// Initialize nodes
		const tempNodes = this.state.nodes;
		const tempList = this.props.nodes;
		for ( let tempKey in tempList )
		{
			let tempElement = this.createElement( tempList[ tempKey ] );
			if ( tempElement != null )
			{
				tempNodes[ tempKey ] = tempElement;
			}
		}
		
		this.forceUpdate();
	}
	
	componentWillUnmount()
	{
		// Clear events
		this._onNodesDispose();
		this._onNodesDispose = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragUp );
		document.removeEventListener( "keydown", this._onKeyDown );
	}
	
	shouldComponentUpdate( tNextProps, tNextState )
	{
		return false; // TODO: why have a state if this is false?
	}
	
	onNodes( tChange )
	{
		var tempNodes = this.state.nodes;
		if ( tChange.type === "add" )
		{
			const tempElement = this.createElement( tChange.newValue );
			if ( tempElement != null )
			{
				tempNodes[ tChange.name ] = tempElement;
			}
		}
		else if ( tChange.type === "remove" )
		{
			delete tempNodes[ tChange.name ];
		}
		
		this.forceUpdate(); // TODO: figure out how to optimize this so render isn't called each time
	}
	
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel._id, onLink: this.props.onLink, onSelected: this._onNodeSelected, onDragStart: this._onDragStart } );
	}
	
	setSelected( tNode )
	{
		if ( tNode != null )
		{			
			const tempSelected = this.state.selected;
			if ( tempSelected[ tNode._id ] === undefined )
			{
				if ( this._selectedCount === 0 )
				{
					document.addEventListener( "keydown", this._onKeyDown );
				}
				
				tempSelected[ tNode._id ] = tNode;
				++this._selectedCount;
			
				this.forceUpdate();
				
				return true;
			}
		}
		
		return false;
	}
	
	removeSelected( tNode )
	{
		if ( tNode != null && this._selectedCount > 0 )
		{
			const tempSelected = this.state.selected;
			if ( tempSelected[ tNode._id ] !== undefined )
			{
				delete tempSelected[ tNode._id ];
				--this._selectedCount;
				
				if ( this._selectedCount <= 0 )
				{
					this._selectedCount = 0;
					
					document.removeEventListener( "keydown", this._onKeyDown );
				}
				
				this.forceUpdate();
				
				return true;
			}
		}
		
		return false;
	}
	
	clearSelected()
	{
		const tempSelected = this.state.selected;
		for ( let tempID in tempSelected )
		{
			tempSelected[ tempID ].isSelected = false;
		}
	}
	
	onDragStart( tEvent )
	{
		if ( this._selectedCount > 0 )
		{
			const tempLocalStart = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.zoom ).subtract( this.props.position );
			
			this._dragOffsets = {};
			for ( let tempID in this.state.selected )
			{
				this._dragOffsets[ tempID ] = Vector2D.Subtract( tempLocalStart, this.state.selected[ tempID ].position );
			}
		
			document.addEventListener( "mousemove", this._onDragMove );
			document.addEventListener( "mouseup", this._onDragUp );
		}
	}
	
	onDragMove( tEvent )
	{
		const tempLocalEnd = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.zoom ).subtract( this.props.position );
		
		// Grid snap
		const tempSelected = this.state.selected;
		if ( this.props.isGridSnap )
		{
			const tempGridSnap = this.props.gridSize / this.props.snapIncrement;
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
	
	onDragUp( tEvent )
	{
		this._dragOffsets = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragUp );
	}
	
	onMarqueeMove( tLocalStart, tLocalEnd ) // TODO: clean up
	{
		const tempBounds = Bounds.FromCorners( tLocalStart, tLocalEnd );
		for ( let tempID in this.state.nodes )
		{
			let tempModel = this.state.nodes[ tempID ].props.model;
			tempModel.isSelected = tempBounds.contains( tempModel.position );
		}
	}
	
	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			for ( let tempID in this.state.selected )
			{
				this.props.onRemoveNode( this.state.selected[ tempID ] );
			}
		}
	}
	
	render()
	{
		var tempElements = null;
		if ( this._selectedCount > 0 )
		{
			tempElements = [];
			
			// Deselected nodes
			for ( let tempID in this.state.nodes )
			{
				if ( this.state.selected[ tempID ] === undefined )
				{
					if ( tempElements === null )
					{
						tempElements = [];
					}
					
					tempElements.push( this.state.nodes[ tempID ] );
				}
			}
			
			// Selected nodes
			for ( let tempID in this.state.selected )
			{
				tempElements.push( this.state.nodes[ tempID ] );
			}
		}
		else
		{
			for ( let tempID in this.state.nodes )
			{
				if ( tempElements === null )
				{
					tempElements = [];
				}
				
				tempElements.push( this.state.nodes[ tempID ] );
			}
		}
		
		return (
			<g className="nodes">
				{ tempElements }
			</g>
		);
	}
}

Nodes.propTypes =
{
	nodes: PropTypes.objectOf( PropTypes.instanceOf( NodeModel ) ).isRequired,
	onLink: PropTypes.func.isRequired,
	onRemoveNode: PropTypes.func.isRequired,
	snapIncrement: PropTypes.number,
	position: PropTypes.instanceOf( Vector2D ),
	zoom: PropTypes.number,
	gridSize: PropTypes.number,
	isGridSnap: PropTypes.bool
};

Nodes.defaultProps =
{
	snapIncrement: 5,
	position: new Vector2D(),
	zoom: 1,
	gridSize: 80,
	isGridSnap: false
};