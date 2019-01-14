import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { observe } from "mobx";
import NodeModel from "../../../Node";
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
		
		// Events
		this._onNodesDispose = observe( tProps.nodes, ( tChange ) => { this.onNodes( tChange ); } );
		this._onNodeMouseDown = ( tEvent ) => { this.onNodeMouseDown( tEvent ); };
		this._onNodeMouseUp = ( tEvent ) => { this.onNodeMouseUp( tEvent ); };
	}
	
	componentDidMount()
	{
		// Initialize
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
		
		this.setState( { nodes: tempNodes } );
	}
	
	componentWillUnmount()
	{
		this._onNodesDispose();
		this._onNodesDispose = null;
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
		
		this.setState( { nodes: tempNodes } ); // TODO: figure out how to optimize this so render isn't called each time
	}
	
	createElement( tModel )
	{
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel._id, onLink: this.props.onLink, onMouseDown: this._onNodeMouseDown, onMouseUp: this._onNodeMouseUp } );
	}
	
	onNodeMouseDown( tNode )
	{
		if ( tEvent.button !== 1  ) // middle-mouse is pan
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
	}
	
	onNodeMouseUp( tEvent, tNode )
	{
		// Toggle node selection if within simulated click time
		if ( tEvent.button !== 1 && this._dragTimeout !== null ) // middle-mouse is pan
		{
			// Clear timer
			clearTimeout( this._dragTimeout );
			this._dragTimeout = null;
			
			// Add/remove node from selection
			if ( tNode.isSelected )
			{
				this.removeSelected( tNode );
			}
			else
			{
				this.addSelected( tNode );
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
	nodes: PropTypes.objectOf( PropTypes.instanceOf( NodeModel ) ).isRequired,
	onLink: PropTypes.func.isRequired,
};

export default observer( Nodes );