import React from "react";
import PropTypes from "prop-types";
import { observe } from "mobx";
import { observer } from "mobx-react";
import Vector2D from "../../../../core/Vector2D";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeEdge";
import Style from "./EdgeTypeMenu.module.css";

class EdgeTypeMenu extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			target: null
		};
		
		// Variables
		this._element = null;
		this._endPosition = null;
		this._type = "default";
		
		// Events
		this._onLinkingPinDispose = observe( tProps.graph, "linkingPin", ( tChange ) => { this.onLinkingPin( tChange ); } );
		this._onElement = ( tElement ) => { this._element = tElement; };
		this._onType = ( tEvent ) => { this._type = tEvent.target.value; };
		this._onSet = ( tEvent ) => { this.onSet( tEvent ); };
		
	}
	
	componentWillUnmount()
	{
		this._onLinkingPinDispose();
		this._onLinkingPinDispose = null;
	}
	
	onLinkingPin( tChange )
	{
		if ( tChange.newValue == null )
		{
			this.setState( { target: null } );
		}
	}
	
	onTargetPin( tPinModel, tEvent )
	{
		if ( this.state.target === null )
		{
			// Position
			this._endPosition = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / this.props.graph.zoom ).subtract( this.props.graph.position ); // this will be mouse move
			this._element.setAttribute( "x", this._endPosition.x );
			this._element.setAttribute( "y", this._endPosition.y );
			
			// Open
			this.setState( { target: tPinModel } );
		}
	}

	onSet( tEvent )
	{
		// Get type
		const tempGraph = this.props.graph;		
		var tempType = tempGraph._edgeTypes[ this._type ];
		if ( tempType == null )
		{
			tempType = new TypeModel();
			tempGraph.setEdgeType( tempType );
		}
		
		// Apply link
		const tempEdge = new tempType._modelClass( tempType, tempGraph.linkingPin, this.state.target );
		tempGraph.linkingPin.setLink( tempEdge );
		tempGraph.linkingPin = null;
	}
	
	render( tStyle = Style )
	{
		// Class
		var tempClass = `${ tStyle.menu }`;
		if ( this.state.target != null )
		{
			tempClass += ` ${ tStyle.open }`;
		}
		
		// Render
		return (
			<foreignObject ref={ this._onElement } className={ tempClass }>
				<div className={ tStyle.inner }>
					<select onChange={ this._onType }>
						<option key="default" value="default">default</option>
						{
							Object.keys( this.props.graph._edgeTypes ).map(
								( tKey ) =>
								{
									if ( tKey === "default" )
									{
										return null;
									}
									
									return (
										<option key={ tKey } value={ tKey }>{ tKey }</option>
									);
								}
							)
						}
					</select>
					<button className={ tStyle.create } onClick={ this._onSet }>create edge</button>
				</div>
			</foreignObject>
		);
	}
}

EdgeTypeMenu.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( EdgeTypeMenu );