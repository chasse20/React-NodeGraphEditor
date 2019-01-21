import { observable, decorate } from "mobx";

export default class Edge
{
	constructor( tType, tSource, tTarget )
	{
		this._type = tType;
		this._source = tSource;
		this._target = tTarget;
		this.isSelected = false;
	}
	
	get id()
	{
		return this._source.id + this._target.id;
	}
}

decorate( Edge,
	{
		isSelected: observable
	}
);