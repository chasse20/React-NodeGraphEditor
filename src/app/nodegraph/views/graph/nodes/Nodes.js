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
		
		// Events
		this._onNodesDispose = observe( tProps.nodes, ( tChange ) => { this.onNodes( tChange ); } );
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
		console.log( "???" );
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel._id, onLink: this.props.onLink } );
	}
	
	// DRAG
	
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