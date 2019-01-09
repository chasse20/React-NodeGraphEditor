import { observable, decorate } from "mobx";

export default class Type
{
	constructor( tModelClass, tViewClass, tData = {} )
	{
		this._modelClass = tModelClass;
		this._viewClass = tViewClass;
		this.data = tData;
	}
}

decorate( Type,
	{
		data: observable
	}
);