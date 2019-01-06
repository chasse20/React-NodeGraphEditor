import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../nodegraph/Graph";
import Vector2D from "../../core/Vector2D";
import Matrix2D from "../../core/Matrix2D";
import SelectionModel from "../Selection";
import GridModel from "../Grid";
import "./Selection.css";

class Selection extends React.Component // TODO: Primitive Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._marqueeElement = null;
		this._panOffset = new Vector2D();
		this._isMarquee = false;
		this._marqueeOffset = new Vector2D();
		this._marqueeScreen = new Vector2D(); // for dealing with zoom changes
		this._nodes = null;
		this._nodeOffset = new Vector2D();
		this._nodeStarts = null;
		this._nodeDragTimeout = null;
		
		// Events
		this._onMarqueeElement = ( tElement ) => { this._marqueeElement = tElement; };
		this._onPanMove = ( tEvent ) => { this.onPanMove( tEvent ); };
		this._onPanStop = ( tEvent ) => { this.onPanStop( tEvent ); };
		this._onMarqueeMove = ( tEvent ) => { this.onMarqueeMove( tEvent ); };
		this._onMarqueeStop = ( tEvent ) => { this.onMarqueeStop( tEvent ); };
		this._onNodesMove = ( tEvent ) => { this.onNodesMove( tEvent ); };
		this._onNodesStop = ( tEvent ) => { this.onNodesStop( tEvent ); };
	}
	
	componentWillUnmount()
	{
		// Reset selection states
		this.onPanStop();
		this.onMarqueeStop();
		this.clearNodes();
		
		// Events
		if ( this._nodeDragTimeout !== null )
		{
			clearTimeout( this._nodeDragTimeout );
		}
	}
	
	clearNodes()
	{
		this.onNodesStop();
		if ( this._nodes !== null )
		{
			for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
			{
				this._nodes[i].isSelected = false;
			}
			this._nodes = null;
		}
		
		this.props.model.isStuffSelected = false;
	}
	
	onSelectGraph( tEvent )
	{
		if ( tEvent == null )
		{
			this.onPanStop();
			this.onMarqueeStop();
		}
		else
		{
			tEvent.stopPropagation();
			
			// Pan
			if ( tEvent.button === 1 ) // middle mouse
			{
				this.props.model.isPanningHeld = !this.props.model.isPanningHeld;
			}
			
			if ( this.props.model.isPanMode || this.props.model.isPanningHeld )
			{
				const tempGraph = this.props.graph;
				tempGraph.isSelected = true;
				
				const tempTransform = tempGraph._transform;
				this._panOffset = Matrix2D.MultiplyPoint( this.props.viewTransform.worldToLocalMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) );
				
				document.addEventListener( "mousemove", this._onPanMove );
				document.addEventListener( "mouseup", this._onPanStop );
			}
			// Marquee
			else
			{
				this.clearNodes();
				
				const tempTransform = this.props.graph._transform;
				this._marqueeScreen = new Vector2D( tEvent.clientX, tEvent.clientY );
				this._marqueeOffset = Matrix2D.MultiplyPoint( tempTransform.localToWorldMatrix, this._marqueeScreen ).subtract( tempTransform.worldPosition );
				this.props.model.isMarqueeHeld = true;
				
				document.addEventListener( "mousemove", this._onMarqueeMove );
				document.addEventListener( "mouseup", this._onMarqueeStop );
			}
		}
	}
	
	onPanMove( tEvent )
	{
		const tempTransform = this.props.graph._transform;
		tempTransform.worldPosition = Matrix2D.MultiplyPoint( this.props.viewTransform.worldToLocalMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._panOffset );
	}
	
	onPanStop( tEvent )
	{
		this.props.graph.isSelected = false;
		this.props.model.isPanningHeld = false;
		
		document.removeEventListener( "mousemove", this._onPanMove );
		document.removeEventListener( "mouseup", this._onPanStop );
	}
	
	onMarqueeMove( tEvent )
	{
		const tempTransform = this.props.graph._transform;
		
		const tempWorldPosition = Matrix2D.MultiplyPoint( tempTransform.worldToLocalMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) );
		console.log( tempWorldPosition );
		
		//this._marqueeScreen = new Vector2D( tEvent.clientX, tEvent.clientY );
		//const tempStart = Matrix2D.MultiplyPoint( this.props.graph._transform.localMatrix, this._marqueeOffset );
		//console.log( tempStart );
		
		//const tempEnd = Matrix2D.MultiplyPoint( this.props.graph._transform.localToWorldMatrix, Matrix2D.MultiplyPoint( this.props.graph._transform.worldToLocalMatrix, this._marqueeScreen ) );
		//console.log( Matrix2D.MultiplyPoint( this.props.graph._transform.worldToLocalMatrix, this._marqueeScreen ) );
		
		/*if ( tempEnd.x < tempStart.x )
		{
			this._marqueeElement.setAttribute( "x", tempEnd.x );
			this._marqueeElement.setAttribute( "width", tempStart.x - tempEnd.x );
		}
		else
		{
			this._marqueeElement.setAttribute( "x", tempStart.x );
			this._marqueeElement.setAttribute( "width", tempEnd.x - tempStart.x );
		}
		
		if ( tempEnd.y < tempStart.y )
		{
			this._marqueeElement.setAttribute( "y", tempEnd.y );
			this._marqueeElement.setAttribute( "height", tempStart.y - tempEnd.y );
		}
		else
		{
			this._marqueeElement.setAttribute( "y", tempStart.y );
			this._marqueeElement.setAttribute( "height", tempEnd.y - tempStart.y );
		}*/
	}
	
	onMarqueeStop( tEvent )
	{
		this.props.model.isMarqueeHeld = false;
		
		this._marqueeElement.setAttribute( "x", 0 );
		this._marqueeElement.setAttribute( "y", 0 );
		this._marqueeElement.setAttribute( "width", 0 );
		this._marqueeElement.setAttribute( "height", 0 );
		
		document.removeEventListener( "mousemove", this._onMarqueeMove );
		document.removeEventListener( "mouseup", this._onMarqueeStop );
	}
	
	onSelectNode( tEvent, tNode )
	{
		if ( tEvent == null )
		{
			this.onNodesStop();
		}
		else if ( tEvent.button === 0 ) // must be first mouse button
		{
			tEvent.stopPropagation();
			
			if ( tEvent.type === "mousedown" )
			{
				if ( tNode.isSelected )
				{
					clearTimeout( this._nodeDragTimeout );
					this._nodeDragTimeout = setTimeout(
						() =>
						{
							this._nodeDragTimeout = null;
						},
						200
					);
				}
				
				this.addNode( tNode );
				this._nodeOffset = Matrix2D.MultiplyPoint( this.props.viewTransform.worldToLocalMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) );
				this._nodeStarts = [];
				
				const tempListLength = this._nodes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					this._nodeStarts.push( this._nodes[i]._transform.worldPosition );
				}
			
				document.addEventListener( "mousemove", this._onNodesMove );
				document.addEventListener( "mouseup", this._onNodesStop );
			}
			else if ( this._nodeDragTimeout !== null && tEvent.type === "mouseup" )
			{
				if ( tNode.isSelected )
				{
					this.removeNode( tNode );
				}
				else
				{
					this.addNode( tNode );
				}
				
				clearTimeout( this._nodeDragTimeout );
				this._nodeDragTimeout = null;
			}
		}
	}
	
	onNodesMove( tEvent )
	{
		const tempMouseOffset = Matrix2D.MultiplyPoint( this.props.viewTransform.worldToLocalMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._nodeOffset );
		console.log( tempMouseOffset );
		if ( this.props.model.isSnapping )
		{
			const tempGridSnap = this.props.grid.size / this.props.model.snapIncrement;
			for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
			{
				this._nodes[i]._transform.worldPosition = new Vector2D( Math.round( ( tempMouseOffset.x + this._nodeStarts[i].x ) / tempGridSnap ) * tempGridSnap, Math.round( ( tempMouseOffset.y + this._nodeStarts[i].y ) / tempGridSnap ) * tempGridSnap );
			}
		}
		else
		{
			for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
			{
				this._nodes[i]._transform.worldPosition = Vector2D.Add( tempMouseOffset, this._nodeStarts[i] );
			}
		}
	}
	
	onNodesStop( tEvent )
	{
		this._nodeStarts = null;
		
		document.removeEventListener( "mousemove", this._onNodesMove );
		document.removeEventListener( "mouseup", this._onNodesStop );
	}
	
	addNode( tNode ) // TODO: Reorder newest selection models in Graph!
	{
		if ( tNode != null )
		{
			if ( this._nodes === null )
			{
				this._nodes = [];
				this._nodes.push( tNode );
				
				tNode.isSelected = true;
				this.props.model.isStuffSelected = true;
				
				return true;
			}
			else if ( this._nodes.indexOf( tNode ) < 0 )
			{
				this._nodes.push( tNode );
				tNode.isSelected = true;
				
				return true;
			}
		}
		
		return false;
	}
	
	removeNode( tNode )
	{
		if ( tNode != null && this._nodes !== null )
		{
			const tempIndex = this._nodes.indexOf( tNode );
			if ( tempIndex >= 0 )
			{
				this._nodes.splice( tempIndex, 1 );
				if ( this._nodes.length === 0 )
				{
					this._nodes = null;
					
					this.props.model.isStuffSelected = false;
				}
				
				tNode.isSelected = false;
				
				return true;
			}
		}
		
		return false;
	}
	
	onDelete()
	{
		if ( this._nodes !== null )
		{
			for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
			{
				this.props.graph.removeNode( this._nodes[i] );
			}
			
			this._nodes = null;
		}
		
		this._nodesOffsets = null;
		this.props.model.isStuffSelected = false;
	}
	
	onSelectEdge( tEvent, tEdge ) // TODO: do
	{
	}
	
	render()
	{
		return (
			<svg className={ this.props.model.isMarqueeHeld ? "selection marquee" : "selection" }>
				<rect ref={ this._onMarqueeElement }/>
			</svg>
		);
	}
}

Selection.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	grid: PropTypes.instanceOf( GridModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Selection );