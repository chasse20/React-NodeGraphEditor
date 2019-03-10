/**
*	Type model definition
*	@memberof nodegraph-base
*	@param {string} tName Key name of this type used for lookups in the graph
*	@param {Object} tModelClass Model class of this type
*	@param {Object} tViewClass View class of this type
*/
export default class Type
{
	constructor( tName, tModelClass, tViewClass )
	{
		/**
		*	Key name of this used for lookups in the graph
		*	@type {string}
		*/
		this._name = tName;
		/**
		*	Model class of this type
		*	@type {Object}
		*/
		this._modelClass = tModelClass;
		/**
		*	View class of this type
		*	@type {Object}
		*/
		this._viewClass = tViewClass;
	}
}