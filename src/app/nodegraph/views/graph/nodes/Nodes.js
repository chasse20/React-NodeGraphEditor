import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import Bounds from "../../../../core/Bounds";
import Vector2D from "../../../../core/Vector2D";
import NodeModel from "../../../models/Node";
import Node from "../node/Node";
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
			isDragging: false
		};
		
		// Variables
		this._nodes = null;
		this._nodesCount = 0;
		this._dragOffsets = null;
		
		// Events
		this._onNodesDispose = observe( tProps.nodes, ( tChange ) => { this.onNodes( tChange ) } );
		this._onSelectedDispose = observe( tProps.selected, ( tChange ) => { this.onSelected( tChange ) } );
		this._onDragStart = ( tEvent ) => { this.onDragStart( tEvent ); };
		this._onDragMove = ( tEvent ) => { this.onDragMove( tEvent ); };
		this._onDragUp = ( tEvent ) => { this.onDragUp( tEvent ); };
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
	}
	
	componentDidMount()
	{
		// Initialize nodes
		const tempNodes = this.props.nodes;
		for ( let tempID in tempNodes )
		{
			this.setNode( this.createElement( tempNodes[ tempID ] ) );
		}
		
		// Selected state
		if ( this.props.selected.size > 0 )
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
		var tempViewClass = tModel._type._viewClass;
		if ( tempViewClass == null )
		{
			tempViewClass = Node;
		}
		
		return React.createElement( tempViewClass,
			{
				model: tModel,
				key: tModel._id,
				onLink: this.props.onLink,
				onSelected: this.props.onSelectNode,
				onDragStart: this._onDragStart 
			}
		);
	}
	
	onNodes( tChange )
	{
		console.log( tChange );
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
			
			const tempSelected = this.props.selected;
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
		const tempListLength = this.props.selected.length;
		if ( tempListLength > 0 )
		{
			const tempLocalStart = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.zoom ).subtract( this.props.position );
			
			this._dragOffsets = [];
			
			for ( let i = 0; i < tempListLength; ++i )
			{
				this._dragOffsets.push( Vector2D.Subtract( tempLocalStart, this.props.selected[i].position ) );
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
		const tempSelected = this.props.selected;
		if ( this.props.isGridSnap )
		{
			const tempGridSnap = this.props.gridSize / this.props.snapIncrement;
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
		
		this.setState( { isDragging: false } );
	}
	
	onMarqueeMove( tLocalStart, tLocalEnd ) // TODO: clean up
	{
		const tempBounds = Bounds.FromCorners( tLocalStart, tLocalEnd );
		for ( let tempID in this._nodes )
		{
			let tempModel = this._nodes[ tempID ].props.model;
			this.props.onSelectNode( tempModel, tempBounds.contains( tempModel.position ) );
		}
	}
	
	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			const tempSelected = this.props.selected;
			console.log( tempSelected );
			for ( let i = ( tempSelected.length - 1 ); i >= 0; --i )
			{
				this.props.onRemoveNode( tempSelected[i] );
			}
		}
	}

	render()
	{
		// Class
		var tempClass = "nodes";
		if ( this.state.isDragging )
		{
			tempClass += " dragging";
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
	selected: PropTypes.arrayOf( PropTypes.instanceOf( NodeModel ) ).isRequired,
	onLink: PropTypes.func.isRequired,
	onSelectNode: PropTypes.func.isRequired,
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