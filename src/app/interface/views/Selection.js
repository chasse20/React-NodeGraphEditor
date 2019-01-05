import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../nodegraph/Graph";
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
		this._nodeOffset = new Vector2D();
		this._nodeOffsets = null;
		this._isRecentlyToggled = true;
		this._nodeDragTimeout = null;
		
		// Events
		this._onGraphMove = ( tEvent ) => { this.onGraphMove( tEvent ); };
		this._onGraphStop = ( tEvent ) => { this.onGraphStop( tEvent ); };
		this._onNodesMove = ( tEvent ) => { this.onNodesMove( tEvent ); };
		this._onNodesStop = ( tEvent ) => { this.onNodesStop( tEvent ); };
	}
	
	componentWillUnmount()
	{
		// Reset selection states
		this.props.graph.isSelected = false;
		if ( this._nodes !== null )
		{
			for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
			{
				this._nodes[i].isSelected = false;
			}
		}
		
		// Events
		document.removeEventListener( "mousemove", this._onGraphMove );
		document.removeEventListener( "mouseup", this._onGraphStop );
		document.removeEventListener( "mousemove", this._onNodesMove );
		document.removeEventListener( "mouseup", this._onNodesStop );
		
		if ( this._nodeDragTimeout !== null )
		{
			clearTimeout( this._nodeDragTimeout );
		}
	}
	
	onSelectGraph( tEvent )
	{
		if ( tEvent == null )
		{
			this.onGraphStop();
		}
		else
		{
			tEvent.stopPropagation();
			
			// Pan
			if ( tEvent.button === 1 ) // middle mouse
			{
				this.props.model.isPanningHeld = !this.props.model.isPanningHeld;
			}
			
			if ( this.props.model.isPanning || this.props.model.isPanningHeld )
			{
				const tempGraph = this.props.graph;
				tempGraph.isSelected = true;
				
				const tempTransform = tempGraph._transform;
				this._graphOffset = Matrix2D.MultiplyPoint( tempTransform.localToWorldMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( tempTransform.worldPosition );
				
				document.addEventListener( "mousemove", this._onGraphMove );
				document.addEventListener( "mouseup", this._onGraphStop );
			}
			// Marquee
			else
			{
				// Clear selected nodes
				this.onNodesStop( tEvent );
				if ( this._nodes !== null )
				{
					for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
					{
						this._nodes[i].isSelected = false;
					}
					this._nodes = null;
				}
				
				// Marquee
			}
		}
	}
	
	onGraphMove( tEvent )
	{
		const tempTransform = this.props.graph._transform;
		tempTransform.worldPosition = Matrix2D.MultiplyPoint( tempTransform.localToWorldMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._graphOffset );
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
		if ( tEvent == null )
		{
			this.onNodesStop();
		}
		else if ( tEvent.button === 0 ) // must be first mouse button
		{
			tEvent.stopPropagation();
			
			if ( tEvent.type === "mousedown" )
			{
				if ( tNode.isSelected || !this._isRecentlyToggled )
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
				this._nodeOffset = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.graph._transform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) );
				this._nodeOffsets = [];
				
				const tempListLength = this._nodes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					this._nodeOffsets.push( this._nodes[i]._transform.worldPosition );
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
				this._isRecentlyToggled = true;
			}
		}
	}
	
	onNodesMove( tEvent )
	{
		const tempMouseOffset = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.graph._transform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._nodeOffset );
		for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
		{
			this._nodes[i]._transform.worldPosition = Vector2D.Add( tempMouseOffset, this._nodeOffsets[i] );
		}
	}
	
	onNodesStop( tEvent )
	{
		this._nodeOffsets = null;
		
		document.removeEventListener( "mousemove", this._onNodesMove );
		document.removeEventListener( "mouseup", this._onNodesStop );
	}
	
	addNode( tNode )
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
	
	render() // MARQUEE GOES HERE
	{
		return null;
	}
}

Selection.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( Selection );