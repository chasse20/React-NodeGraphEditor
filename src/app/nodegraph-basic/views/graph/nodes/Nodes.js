import React from "react";
import PropTypes from "prop-types";
import NodesBase from "../../../../nodegraph/views/graph/nodes/Nodes";

export default class Nodes extends NodesBase
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state.linkingPin = null;
		
		// Events
		this._onPinLinking = ( tPin, tIsStart ) => { this.onPinLinking( tPin, tIsStart ); };
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
				onDragStart: this._onDragStart ,
				onPhysics: this.props.onPhysics
			}
		);
	}
	
	removeSelected( tID )
	{
		if ( super.removeSelected( tID ) )
		{
			if ( this.state.linkingPin != null && this.state.linkingPin._node._id === tID )
			{
				this.setState( { linkingPin: null } );
			}

			return true;
		}
		
		return false;
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
	onPhysics: PropTypes.func.isRequired
};