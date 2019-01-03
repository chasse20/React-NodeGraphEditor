import { decorate, observable } from "mobx";

export default class Grid
{
	constructor( tIsVisible = true )
	{
		this.isVisible = tIsVisible;
	}
}

decorate( Grid,
	{
		isVisible: observable
	}
);