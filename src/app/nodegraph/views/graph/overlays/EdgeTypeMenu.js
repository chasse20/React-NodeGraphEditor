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
		this._lineElement = null;
		this._menuElement = null;
		this._type = null;
		
		// Events
		this._onLinkingPin = observe( tProps.graph, "linkingPin", ( tChange ) => { this.sourcePin = tChange.newValue; } );
		this._onSourceMove = null;
		this._onLineElement = ( tElement ) => { this._lineElement = tElement; };
		this._onMenuElement = ( tElement ) => { this._menuElement = tElement; };
		this._onType = ( tEvent ) => { this._type = tEvent.target.value; };
		this._onSet = () => { this.onSet(); };
		this._onMouseMove = ( tEvent ) => { this.onMouseMove( tEvent ); };		
	}
	
	componentDidMount()
	{
		this.sourcePin = this.props.graph.linkingPin;
	}
	
	componentWillUnmount()
	{
		if ( this._onSourceMove !== null )
		{
			this._onSourceMove();
			this._onSourceMove = null;
		}
		
		this._onLinkingPin();
		this._onLinkingPin = null;
		
		document.removeEventListener( "mousemove", this._onMouseMove );
	}

	onSet()
	{
		// Get type
		const tempGraph = this.props.graph;		
		var tempType = this._type == null ? tempGraph._edgeTypes[ "default" ] : tempGraph._edgeTypes[ this._type ];
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
	
	onMouseMove( tEvent )
	{
		const tempGraph = this.props.graph;
		this.targetPosition = new Vector2D( tEvent.clientX, tEvent.clientY ).scale( 1 / tempGraph.zoom ).subtract( tempGraph.position );
	}
	
	set sourcePin( tPinModel )
	{
		if ( tPinModel == null )
		{
			if ( this._onSourceMove !== null )
			{
				this._onSourceMove();
				this._onSourceMove = null;
			}
			
			this.targetPin = null;
		}
		else
		{
			this._onSourceMove = observe( tPinModel, "position", ( tChange ) => { this.sourcePosition = tChange.newValue; } );
			
			const tempPosition = tPinModel.position;
			this.sourcePosition = tempPosition;
			
			this._lineElement.setAttribute( "x1", tempPosition.x );
			this._lineElement.setAttribute( "y1", tempPosition.y );
			this._lineElement.setAttribute( "x2", tempPosition.x );
			this._lineElement.setAttribute( "y2", tempPosition.y );
			
			document.addEventListener( "mousemove", this._onMouseMove );
		}
	}
	
	set targetPin( tPinModel )
	{
		if ( tPinModel != null )
		{
			// Position
			const tempPosition = tPinModel.position;
			this.targetPosition = tempPosition;
			this._menuElement.setAttribute( "x", tempPosition.x );
			this._menuElement.setAttribute( "y", tempPosition.y );
			
			// Remove event
			document.removeEventListener( "mousemove", this._onMouseMove );
		}
		
		this.setState( { target: tPinModel } );
	}
	
	set sourcePosition( tVector )
	{
		this._lineElement.setAttribute( "x1", tVector.x );
		this._lineElement.setAttribute( "y1", tVector.y );
	}
	
	set targetPosition( tVector )
	{
		this._lineElement.setAttribute( "x2", tVector.x );
		this._lineElement.setAttribute( "y2", tVector.y );
	}
	
	render( tStyle = Style )
	{
		// Class
		var tempLineClass = `${ tStyle.line }`;
		if ( this.props.graph.linkingPin != null )
		{
			tempLineClass += ` ${ tStyle.lineVisible }`;
		}
		
		var tempMenuClass = `${ tStyle.menu }`;
		if ( this.state.target != null )
		{
			tempMenuClass += ` ${ tStyle.menuOpen }`;
		}
		
		// Render
		return (
			<g>
				<line ref={ this._onLineElement } className={ tempLineClass }/>
				<foreignObject ref={ this._onMenuElement } className={ tempMenuClass } width="400" height="44">
					<div className={ tStyle.inner }>
						<select onChange={ this._onType }>
							<option key="default" value={ null }>default</option>
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
			</g>
		);
	}
}

EdgeTypeMenu.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( EdgeTypeMenu );