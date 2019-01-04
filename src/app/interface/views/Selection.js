import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Transform2DModel from "../../core/Transform2D";
import Vector2D from "../../core/Vector2D";
import Matrix2D from "../../core/Matrix2D";
import SelectionModel from "../Selection";
import "./Selection.css";

class Selection extends React.Component // TODO: Primitive Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._graphOffset = new Vector2D();
		this._nodes = null;
		this._nodeOffsets = null;
		this._nodesTimeout = null; // clicking on a node toggles selection, so this is a delay before confirming a user intends to drag
		
		// Events
		this._onGraphMove = ( tEvent ) => { this.onGraphMove( tEvent ); };
		this._onGraphStop = ( tEvent ) => { this.onGraphStop( tEvent ); };
		this._onNodesMove = ( tEvent ) => { this.onNodesMove( tEvent ); };
		this._onNodesStop = ( tEvent ) => { this.onNodesStop( tEvent ); };
	}
	
	componentWillUnmount()
	{
		
	}
	
	onSelectGraph( tEvent )
	{
		tEvent.stopPropagation();

		if ( tEvent == null )
		{
			this.onGraphStop();
		}
		else
		{
			// Middle mouse
			if ( tEvent.button === 1 )
			{
				this.props.model.isPanningHeld = !this.props.model.isPanningHeld;
			}
			
			// Panning
			if ( this.props.model.isPanning || this.props.model.isPanningHeld )
			{
				const tempGraph = this.props.graph;
				tempGraph.isSelected = true;
				
				const tempTransform = tempGraph._transform;
				this._graphOffset = Matrix2D.MultiplyPoint( tempTransform.localToWorldMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( tempTransform.worldPosition );
				
				document.addEventListener( "mousemove", this._onGraphMove );
				document.addEventListener( "mouseup", this._onGraphStop );
			}
			else
			{
				// Clear selected nodes
				// Start marquee
			}
		}
	}
	
	onGraphMove( tEvent )
	{
		const tempTransform = this.props.graph._transform;
		tempTransform.worldPosition = Matrix2D.MultiplyPoint( tempTransform.localToWorldMatrix, tEvent ).subtract( this._graphOffset );
	}
	
	onGraphStop( tEvent )
	{
		this.props.graph.isSelected = false;
		this.props.model.isPanningHeld = false;
		
		document.removeEventListener( "mousemove", this._onGraphMove );
		document.removeEventListener( "mouseup", this._onGraphStop );
	}
	
	onSelectNode( tEvent, tNode )
	{
		tEvent.stopPropagation();
		
		console.log( tEvent.type );
		/*if ( tEvent == null )
		{
		}
		else if ( tEvent.button === 0 )
		{
			tEvent.stopPropagation();
			
			// Click delay... if node not selected, start timer before enabling dragging to give a user the chance to cancel, otherwise remove
			
			if ( tNode.isSelected )
			{
				this.removeNode( tNode );
			}
			else
			{
				this.addNode( tNode );
			}
		}*/
			
		/*if ( tEvent == null )
		{
			this.removeNode( tNode );
		}
		else if ( tEvent.button === 0 )
		{
			tEvent.stopPropagation();			
			
			if ( tNode.state.isSelected )
			{
				this.removeNode( tNode );
			}
			else
			{
				this.addNode( tNode, new Vector2D( tEvent.clientX, tEvent.clientY ) );
			}
		}*/
	}
	
	onDragNode( tEvent, tNode )
	{
		/*
			onMouseDown
				wait 1 second
					if mouseup during that 1 second
						deselect from Selection
					else
						trigger onNodeDrag
		*/
	}
	
	onNodesMove( tEvent )
	{
		
	}
	
	onNodesStop( tEvent )
	{
		
	}
	
	onSelectEdge( tEvent, tEdge ) // TODO: do
	{
	}
	
	render() // MARQUEE GOES HERE
	{
		return <div className="selection"/>;
	}
}

Selection.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired
};

export default observer( Selection );