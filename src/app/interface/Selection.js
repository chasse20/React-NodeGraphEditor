import { decorate, observable } from "mobx";

export default class Selection
{
	constructor( tIsPanning = true, tIsSnapping = false )
	{
		this.isPanning = tIsPanning;
		this.isSnapping = tIsSnapping;
	}
}

decorate( Selection,
	{
		isPanning: observable,
		isSnapping: observable
	}
);