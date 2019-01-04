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
		this._viewOffset = new Vector2D();
		this._graph = null;
		
		// Events
		this._onGraphMove = ( tEvent ) => { this.onGraphMove( tEvent ); };
		this._onGraphStop = ( tEvent ) => { this.onGraphStop( tEvent ); };
	}
	
	componentWillUnmount()
	{
		
	}
	
	onSelectGraph( tEvent, tGraph )
	{
		if ( tEvent == null )
		{
			this.onGraphStop( tEvent );
		}
		else if ( this.props.model.isPanning )
		{
			this._viewOffset = Matrix2D.MultiplyPoint( this.props.viewTransform.localToWorldMatrix, new Vector2D( tEvent.clientX, tEvent.clientY ) ).subtract( this.props.viewTransform.worldPosition );
			this._graph = tGraph;
			this._graph.setState( { isSelected: true } );
			
			document.addEventListener( "mousemove", this._onGraphMove );
			document.addEventListener( "mouseup", this._onGraphStop );
			
			// Stop node dragging event
		}
		else
		{
			// Clear selected nodes
			// Start marquee
		}
	}
	
	onGraphMove( tEvent )
	{
		this.props.viewTransform.worldPosition = Matrix2D.MultiplyPoint( this.props.viewTransform.localToWorldMatrix, tEvent ).subtract( this._viewOffset );
	}
	
	onGraphStop( tEvent )
	{
		this._graph.setState( { isSelected: false } );
		this._graph = null;
		
		document.removeEventListener( "mousemove", this._onGraphMove );
		document.removeEventListener( "mouseup", this._onGraphStop );
	}
	
	onSelectNode( tEvent, tNode )
	{
		if ( tEvent == null )
		{
			// Remove node
		}
		else
		{
			// Add node
		}
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
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};

export default observer( Selection );