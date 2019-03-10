/**
*	Physics model of an edge
*	@memberof nodegraph
*	@param {Edge} tModel Edge model
*/
export default class BodyEdge
{
	constructor( tModel )
	{
		/**
		*	Edge model
		*	@type {Edge}
		*/
		this._model = tModel;
		/**
		*	Managed index within the physics system
		*	@type {number}
		*/
		this.index = -1;
		/**
		*	Unique ID of the source node
		*	@type {number}
		*/
		this.source = tModel._source._node._id;
		/**
		*	Unique ID of the target node
		*	@type {number}
		*/
		this.target = tModel._target._node._id;
	}
}