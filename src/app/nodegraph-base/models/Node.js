import { observable, decorate, values } from "mobx";
import Vector2D from "../../core/Vector2D";
import ID from "../../core/ID";
import Pin from "./Pin";

/**
*	Node model that manages pins
*	@memberof nodegraph-base
*	@param {Graph} tGraph Graph model this belongs to
*	@param {TypeNode} tType Node type
*/
export default class Node
{
	constructor( tGraph, tType )
	{
		/**
		*	Unique ID of this node that gets automatically set
		*	@type {number}
		*/
		this._id = ID.ID;
		/**
		*	Graph model this belongs to
		*	@type {Graph}
		*/
		this._graph = tGraph;
		/**
		*	Node type of this instance
		*	@type {TypeNode}
		*/
		this._type = tType;
		/**
		*	Associative array of pin models, responsible for edge links
		*	@type {Object}
		*/
		this._pins =
		{
			in: new Pin( "in", this, false ),
			out: new Pin( "out", this )
		};
		/**
		*	Current graph position of the node
		*	@type {core.Vector2D}
		*/
		this.position = new Vector2D();
		/**
		*	Flag for whether the node was selected, set from Graph and used for performance reasons
		*	@type {bool}
		*/
		this._isSelected = false;
	}
	
	/**
	*	Clears all links
	*/
	clearLinks()
	{
		const tempPins = values( this._pins );
		for ( let i = ( tempPins.length - 1 ); i >= 0; --i )
		{
			tempPins[i].clearLinks();
		}
	}
	
	/**
	*	Remove all edge links belonging to type
	*	@param {TypeEdge} tType Edge type
	*/
	removeEdgesOfType( tType )
	{
		if ( tType != null )
		{
			const tempPins = values( this._pins );
			for ( let i = ( tempPins.length - 1 ); i >= 0; --i )
			{
				tempPins[i].removeEdgesOfType( tType );
			}
		}
	}
}

decorate( Node,
	{
		_pins: observable.shallow,
		position: observable,
		_isSelected: observable
	}
);