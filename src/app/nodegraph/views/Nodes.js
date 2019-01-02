import React from "react";
import { observer } from "mobx-react";
import { observe } from "mobx";
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
		this._onUpdateDispose = observe( tProps.nodes, ( tChange ) => { this.onUpdate( tChange ); } );
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
		this._onUpdateDispose();
		this._onUpdateDispose = null;
	}
	
	onUpdate( tChange )
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
		return React.createElement( tModel._type._viewClass, { model: tModel, key: tModel._id, onLink: this.props.onLink, onSelectSingle: this.props.onSelectSingle } );
	}
	
	render()
	{	
		return (
			<g className="nodes">
				{ Object.values( this.state.nodes ) }
			</g>
		);
	}
}

export default observer( Nodes );