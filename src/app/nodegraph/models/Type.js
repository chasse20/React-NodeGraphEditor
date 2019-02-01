import { decorate, observable } from "mobx";

export default class Type
{
	constructor( tName, tViewClass = null )
	{
		this._name = tName;
		this._viewClass = tViewClass;
		this.isVisible = true;
	}
}

decorate( Type,
	{
		isVisible: observable
	}
);