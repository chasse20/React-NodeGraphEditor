import { observable, decorate } from "mobx";

export default class Type
{
	constructor( tName, tModelClass, tViewClass, tData = {} )
	{
		this._name = tName;
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