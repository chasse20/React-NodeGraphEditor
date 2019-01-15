import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import Bounds from "../../../../core/Bounds";
import Vector2D from "../../../../core/Vector2D";
import GraphModel from "../../../Graph";
import "./Nodes.css";

class Nodes extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			nodes: {}
		};
		
		// Variables
		this._selected = null;
		this._selectedCount = 0;
		this._dragTimeout = null;
		this._dragOffsets = null;
		
		// Events
		this._onNodesDispose = observe( tProps.graph._nodes, ( tChange ) => { this.onNodes( tChange ); } );
		this._onMarqueeDispose = observe( tProps.graph, "isMarquee", ( tChange ) => { this.isMarquee = tChange.newValue; } );
		this._onNodeMouseDown = ( tEvent, tNode ) => { this.onNodeMouseDown( tEvent, tNode ); };
		this._onNodeMouseUp = ( tEvent, tNode ) => { this.onNodeMouseUp( tEvent, tNode ); };
		this._onDragMove = ( tEvent ) => { this.onDragMove( tEvent ); };
		this._onDragUp = ( tEvent ) => { this.onDragUp( tEvent ); };
		this._onKeyDown = ( tEvent ) => { this.onKeyDown( tEvent ); };
	}
	
	componentDidMount()
	{
		// Initialize nodes
		const tempNodes = this.state.nodes;
		const tempList = this.props.graph._nodes;
		for ( let tempKey in tempList )
		{
			let tempElement = this.createElement( tempList[ tempKey ] );
			if ( tempElement != null )
			{
				tempNodes[ tempKey ] = tempElement;
			}
		}
		
		this.setState( { nodes: tempNodes } );
		
		// Marquee
		this.isMarquee = this.props.graph.isMarquee;
	}
	
	componentWillUnmount()
	{
		// Clear selected
		this.clearSelected();
		
		// Clear timer
		if ( this._dragTimeout !== null )
		{
			clearTimeout( this._dragTimeout );
		}
		
		// Clear events
		this._onNodesDispose();
		this._onNodesDispose = null;
		this._onMarqueeDispose();
		this._onMarqueeDispose = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragUp );
		document.removeEventListener( "keydown", this._onKeyDown );
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
			this.removeSelected( tChange.oldValue );
			delete tempNodes[ tChange.name ];
		}
		
		this.setState( { nodes: tempNodes } ); // TODO: figure out how to optimize this so render isn't called each time
	}
	
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel._id, onLink: this.props.onLink, onPhysics: this.props.onPhysics, onMouseDown: this._onNodeMouseDown, onMouseUp: this._onNodeMouseUp } );
	}
	
	setSelected( tNode )
	{
		if ( tNode != null )
		{
			if ( this._selected === null )
			{
				this._selected = {};
				document.addEventListener( "keydown", this._onKeyDown );
			}
			
			this._selected[ tNode._id ] = tNode;
			++this._selectedCount;
			
			tNode.isSelected = true;
			
			return true;
		}
		
		return false;
	}
	
	removeSelected( tNode )
	{
		if ( tNode != null && this._selectedCount > 0 && this._selected[ tNode._id ] !== undefined )
		{
			delete this._selected[ tNode._id ];
			--this._selectedCount;
			
			if ( this._selectedCount <= 0 )
			{
				this._selectedCount = 0;
				this._selected = null;
			}
			
			tNode.isSelected = false;
			
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
			
			this._selected = null;
			this._selectedCount = 0;
			
			return true;
		}
		
		return false;
	}
	
	onNodeMouseDown( tEvent, tNode )
	{
		tEvent.stopPropagation();
		
		// Drag node
		if ( tEvent.button !== 1 ) // middle-mouse is pan
		{
			// Check for selection toggle click if node is already selected
			if ( this._selectedCount > 0 && this._selected[ tNode._id ] !== undefined )
			{
				clearTimeout( this._dragTimeout );
				this._dragTimeout = setTimeout(
					() =>
					{
						this._dragTimeout = null;
					},
					200
				);
			}
			
			// Add to selection
			this.setSelected( tNode );
			
			if ( this._selectedCount > 0 )
			{
				const tempLocalStart = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.graph.zoom ).subtract( this.props.graph.position );
				this.localStart = tempLocalStart;
				
				this._dragOffsets = {};
				for ( let tempID in this._selected )
				{
					this._dragOffsets[ tempID ] = Vector2D.Subtract( tempLocalStart, this._selected[ tempID ].position );
				}
			
				document.addEventListener( "mousemove", this._onDragMove );
				document.addEventListener( "mouseup", this._onDragUp );
			}
		}
	}
	
	onNodeMouseUp( tEvent, tNode )
	{
		tEvent.stopPropagation();
		
		// Toggle node selection if within simulated click time
		if ( tEvent.button !== 1 && this._dragTimeout !== null ) // middle-mouse is pan
		{
			clearTimeout( this._dragTimeout );
			this._dragTimeout = null;
			
			if ( !this.removeSelected( tNode ) )
			{
				this.setSelected( tNode );
			}
		}
	}
	
	onDragMove( tEvent )
	{
		const tempLocalEnd = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.graph.zoom ).subtract( this.props.graph.position );
		
		// Grid snap
		if ( this.props.graph.isGridSnap )
		{
			const tempGridSnap = this.props.graph.gridSize / this.props.snapIncrement;
			for ( let tempID in this._selected )
			{
				let tempOffset = this._dragOffsets[ tempID ];
				this._selected[ tempID ].position = new Vector2D( Math.round( ( tempLocalEnd.x - tempOffset.x ) / tempGridSnap ) * tempGridSnap, Math.round( ( tempLocalEnd.y - tempOffset.y ) / tempGridSnap ) * tempGridSnap );
			}
		}
		// No snap
		else
		{			
			for ( let tempID in this._selected )
			{
				this._selected[ tempID ].position = Vector2D.Subtract( tempLocalEnd, this._dragOffsets[ tempID ] );
			}
		}
	}
	
	onDragUp( tEvent )
	{
		this._dragOffsets = null;
		
		document.removeEventListener( "mousemove", this._onDragMove );
		document.removeEventListener( "mouseup", this._onDragUp );
	}
	
	set isMarquee( tValue )
	{
		if ( tValue )
		{
			this.clearSelected();
		}
	}
	
	onMarqueeMove( tLocalStart, tLocalEnd )
	{
		const tempBounds = Bounds.FromCorners( tLocalStart, tLocalEnd );
		for ( let tempID in this.state.nodes )
		{
			let tempModel = this.state.nodes[ tempID ].props.model;
			let tempIsSelected = tempBounds.contains( tempModel.position );
			if ( tempIsSelected )
			{
				this.setSelected( tempModel );
			}
			else
			{
				this.removeSelected( tempModel );
			}
		}
	}
	
	onKeyDown( tEvent )
	{
		if ( tEvent.keyCode === 46 ) // delete
		{
			for ( let tempID in this._selected )
			{
				this.props.graph.removeNode( this._selected[ tempID ] );
			}
		}
	}
	
	render()
	{
		/*<filter xmlns="http://www.w3.org/2000/svg" id="edge-glow">
				<feGaussianBlur stdDeviation="6"/>
				<feComponentTransfer>
					<feFuncA type="linear" slope="0.4"/>
				</feComponentTransfer>
				<feMerge> 
					<feMergeNode/>
					<feMergeNode in="SourceGraphic"/> 
				</feMerge>
			</filter>*/
		
		return (
			<g className="nodes">
				{ Object.values( this.state.nodes ) }
			</g>
		);
	}
}

Nodes.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	snapIncrement: PropTypes.number,
	onLink: PropTypes.func.isRequired,
	onPhysics: PropTypes.func.isRequired
};

Nodes.defaultProps =
{
	snapIncrement: 5
};

export default observer( Nodes );