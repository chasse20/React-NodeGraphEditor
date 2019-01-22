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
			nodes: null,
			isDragging: false,
			linkingPin: null
		};
		
		// Variables
		this._nodes = null;
		this._nodesCount = 0;
		this._selected = null;
		this._selectedCount = 0;
		this._dragOffsets = null;
		
		// Events
		this._onNodesDispose = observe( tProps.nodes,
			( tChange ) =>
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
		);
		this._onNodeSelected = ( tNode ) =>
		{
			if ( tNode.isSelected )
			{
				this.setSelected( tNode );
			}
			else
			{
				this.removeSelected( tNode._id );
			}
		};
		this._onPinLinking = ( tPin, tIsStart ) => { this.onPinLinking( tPin, tIsStart ); };
		this._onDragStart = ( tEvent ) => { this.onDragStart( tEvent ); };
		this._onDragMove = ( tEvent ) => { this.onDragMove( tEvent ); };
		this._onDragUp = ( tEvent ) => { this.onDragUp( tEvent ); };
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
	}
	
	componentDidMount()
	{
		// Initialize nodes
		const tempList = this.props.nodes;
		for ( let tempKey in tempList )
		{
			this.setNode( this.createElement( tempList[ tempKey ] ) );
		}
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
	
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass,
			{
				model: tModel,
				key: tModel._id,
				onLink: this.props.onLink,
				onLinking: this._onPinLinking,
				onRemove: this.props.onRemoveNode,
				onSelected: this._onNodeSelected,
				onDragStart: this._onDragStart 
			}
		);
	}
	
	setNode( tNodeView )
	{
		if ( tNodeView != null )
		{
			if ( this._nodesCount <= 0 )
			{
				this._nodesCount = 1;
				this._nodes = {};
				this._nodes[ tNodeView.key ] = tNodeView;
				
				this.updateElements();
				
				return true;
			}
			else if ( this._nodes[ tNodeView.key ] === undefined )
			{
				this._nodes[ tNodeView.key ] = tNodeView;
				++this._nodesCount;
				
				this.updateElements();
				
				return true;
			}
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
				this._nodesCount = 0;
				this._nodes = null;
			}
			
			this.updateElements();
			
			return true;
		}
		
		return false;
	}
	
	setSelected( tNode )
	{
		if ( tNode != null )
		{
			if ( this._selectedCount <= 0 )
			{
				this._selectedCount = 1;
				this._selected = {};
				this._selected[ tNode._id ] = tNode;
				
				this.updateElements();
				
				document.addEventListener( "keydown", this._onKeyDown );
				
				return true;
			}
			else if ( this._selected[ tNode._id ] === undefined )
			{
				this._selected[ tNode._id ] = tNode;
				++this._selectedCount;
				
				this.updateElements();
				
				return true;
			}
		}
		
		return false;
	}
	
	removeSelected( tID )
	{
		if ( this._selectedCount > 0 && this._selected[ tID ] !== undefined )
		{
			delete this._selected[ tID ];
			
			--this._selectedCount;
			if ( this._selectedCount <= 0 )
			{
				this._selectedCount = 0;
				this._selected = null;
				
				document.removeEventListener( "keydown", this._onKeyDown );
			}
			
			if ( this.state.linkingPin != null && this.state.linkingPin._node._id === tID )
			{
				this.setState( { linkingPin: null } );
			}
			
			this.updateElements();
			
			return true;
		}
		
		return false;
	}
	
	clearSelected()
	{
		if ( this._selectedCount > 0 )
		{
			for ( let tempID in this._selected )
			{
				this._selected[ tempID ].isSelected = false;
			}
		}
	}
	
	updateElements()
	{
		if ( this._nodesCount <= 0 )
		{
			this.setState( { nodes: null } );
		}
		else if ( this._selectedCount > 0 )
		{
			// Deselected nodes
			const tempElements = [];
			for ( let tempID in this._nodes )
			{
				if ( this._selected[ tempID ] === undefined )
				{
					tempElements.push( this._nodes[ tempID ] );
				}
			}
			
			// Selected nodes
			for ( let tempID in this._selected )
			{
				tempElements.push( this._nodes[ tempID ] );
			}
			
			this.setState( { nodes: tempElements } );
		}
		else
		{
			this.setState( { nodes: Object.values( this._nodes ) } );
		}
	}
	
	onDragStart( tEvent )
	{
		if ( this._selectedCount > 0 )
		{
			const tempLocalStart = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.zoom ).subtract( this.props.position );
			
			this._dragOffsets = {};
			for ( let tempID in this._selected )
			{
				this._dragOffsets[ tempID ] = Vector2D.Subtract( tempLocalStart, this._selected[ tempID ].position );
			}
		
			document.addEventListener( "mousemove", this._onDragMove );
			document.addEventListener( "mouseup", this._onDragUp );
			
			this.setState( { isDragging: true } );
		}
	}
	
	onDragMove( tEvent )
	{
		const tempLocalEnd = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.zoom ).subtract( this.props.position );
		
		// Grid snap
		const tempSelected = this._selected;
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
		
		this.setState( { isDragging: false } );
	}
	
	onMarqueeMove( tLocalStart, tLocalEnd ) // TODO: clean up
	{
		const tempBounds = Bounds.FromCorners( tLocalStart, tLocalEnd );
		for ( let tempID in this._nodes )
		{
			let tempModel = this._nodes[ tempID ].props.model;
			tempModel.isSelected = tempBounds.contains( tempModel.position );
		}
	}
	
	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			for ( let tempID in this._selected )
			{
				this.props.onRemoveNode( this._selected[ tempID ] );
			}
		}
	}
	
	onPinLinking( tPin, tIsStart )
	{
		
	}
	
	render()
	{
		// Class
		var tempClass = "nodes";
		if ( this.state.isDragging )
		{
			tempClass += " dragging";
		}
		
		if ( this.state.isLinking )
		{
			tempClass += " linking";
		}
		
		// Render
		return (
			<g className={ tempClass }>
				{ this.state.nodes }
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