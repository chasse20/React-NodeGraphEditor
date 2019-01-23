import { observable, decorate } from "mobx";

export default class Edge
{
	constructor( tType, tSource, tTarget )
	{
		this._type = tType;
		this._source = tSource;
		this._target = tTarget;
		this._isSelected = false;
	}
	
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