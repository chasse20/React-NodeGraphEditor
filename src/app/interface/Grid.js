import { decorate, observable } from "mobx";

export default class Grid
{
	constructor( tIsVisible = true, tSize = 100 )
	{
		this.isVisible = tIsVisible;
		this.size = tSize;
	}
}

decorate( Grid,
	{
		isVisible: observable,
		size: observable
	}
);