import React from "react";
import PropTypes from "prop-types";
import Transform2DModel from "../../core/Transform2D";
import Vector2D from "../../core/Vector2D";
import Matrix2D from "../../core/Matrix2D";
import SelectionModel from "../Selection";
import GridModel from "../Grid";

export default class SelectionNodes extends React.Component // TODO: Break up into sub components
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// Variables
		this._mouseStart = null;
		this._offsets = null;
		this._dragTimeout = null;
		
		// Events
		this._onMouseMove = ( tEvent ) => { this.onMouseMove( tEvent ); };
		this._onMouseUp = ( tEvent ) => { this.onMouseUp( tEvent ); };
	}
	
	componentWillUnmount()
	{
		this.clearNodes();
		
		if ( this._nodeDragTimeout !== null )
		{
			clearTimeout( this._nodeDragTimeout );
		}
	}
	
	clearNodes()
	{
		this.onMouseUp();
		this.props.model.clearNodes();
	}
	
	onSelectGraph( tEvent, tGraph )
	{
		if ( tEvent == null )
		{
			this.onMouseUp();
		}
		else if ( !this.props.model.isPanMode && !this.props.model.isPanningHeld ) // clear nodes if not panning
		{
			this.clearNodes();
		}
	}
	
	onSelect( tEvent, tNode )
	{
		if ( tEvent == null )
		{
			this.props.model.removeNode( tNode );
		}
		else if ( tEvent.button !== 1 ) // not panning with middle mouse
		{
			if ( tEvent.type === "mousedown" )
			{
				// Check for selection toggle click if node is already selected
				if ( tNode.isSelected )
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
				this.props.model.addNode( tNode );
				this._mouseStart = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.viewTransform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) );
				this._offsets = [];
				
				const tempNodes = this.props.model._nodes;
				const tempListLength = tempNodes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					this._offsets.push( tempNodes[i]._transform._position );
				}
			
				document.addEventListener( "mousemove", this._onMouseMove );
				document.addEventListener( "mouseup", this._onMouseUp );
			}
			else if ( this._dragTimeout !== null && tEvent.type === "mouseup" ) // deselect if clicked before it goes into drag mode
			{
				// Clear timer
				clearTimeout( this._dragTimeout );
				this._dragTimeout = null;
				
				// Add/remove node from selection
				if ( tNode.isSelected )
				{
					this.props.model.removeNode( tNode );
				}
				else
				{
					this.props.model.addNode( tNode );
				}
			}
		}
	}
	
	onMouseMove( tEvent )
	{
		const tempScreenToWorld = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this.props.viewTransform.localMatrix ), new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this._mouseStart );
		
		const tempNodes = this.props.model._nodes;
		if ( this.props.model.isSnapMode )
		{
			const tempGridSnap = this.props.grid.size / this.props.model.snapIncrement;
			for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
			{
				tempNodes[i]._transform.position = new Vector2D( Math.round( ( tempScreenToWorld.x + this._offsets[i].x ) / tempGridSnap ) * tempGridSnap, Math.round( ( tempScreenToWorld.y + this._offsets[i].y ) / tempGridSnap ) * tempGridSnap );
			}
		}
		else
		{
			for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
			{
				tempNodes[i]._transform.position = Vector2D.Add( tempScreenToWorld, this._offsets[i] );
			}
		}
	}
	
	onMouseUp( tEvent )
	{
		this._mouseStart = null;
		this._offsets = null;
		
		document.removeEventListener( "mousemove", this._onMouseMove );
		document.removeEventListener( "mouseup", this._onMouseUp );
	}
	
	render()
	{
		return null;
	}
}

SelectionNodes.propTypes =
{
	model: PropTypes.instanceOf( SelectionModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	grid: PropTypes.instanceOf( GridModel ).isRequired
};