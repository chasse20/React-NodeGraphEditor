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
				onSelected: this.props.onSelectNode,
				onDragStart: this._onDragStart ,
				onPhysics: this.props.onPhysics
			}
		);
	}
	
	onSelected( tChange )
	{
		super.onSelected( tChange );
		
		if ( tChange.removedCount > 0 && this.state.linkingPin !== null && tChange.removed.indexOf( this.state.linkingPin._node ) >= 0 )
		{
			this.setState( { linkingPin: null } );
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
	onPhysics: PropTypes.func.isRequired
};