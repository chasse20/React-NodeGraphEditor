export default class BodyEdge
{
	constructor( tModel )
	{
		this._model = tModel;
		this.index = -1;
		this.source = tModel._source._node._id;
		this.target = tModel._target._node._id;
	}
}