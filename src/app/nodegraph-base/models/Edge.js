import { observable, decorate } from "mobx";

/**
*	Edge model used for representing a relationship between pins
*	@memberof nodegraph-base
*	@param {TypeEdge} tType Edge type
*	@param {Pin} tSource Source pin reference
*	@param {Pin} tTarget Target pin reference
*/
export default class Edge
{
	constructor( tType, tSource, tTarget )
	{
		/**
		*	Edge type of this instance
		*	@type {TypeEdge}
		*/
		this._type = tType;
		/**
		*	Source pin reference
		*	@type {Pin}
		*/
		this._source = tSource;
		/**
		*	Target pin reference
		*	@type {Pin}
		*/
		this._target = tTarget;
		/**
		*	Flag for whether the edge was selected, set from Graph and used for performance reasons
		*	@type {bool}
		*/
		this._isSelected = false;
	}
	
	/**
	*	Returns a unique string ID of the edge (source pin ID + target pin ID)
	*	@return {string} Unique ID
	*/
	get id()
	{
		return this._source.id + this._target.id;
	}
}

decorate( Edge,
	{
		_isSelected: observable
	}
);