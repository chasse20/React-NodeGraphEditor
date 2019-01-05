import { decorate, observable } from "mobx";

export default class Selection
{
	constructor( tIsPanning = false, tIsSnapping = false )
	{
		this.isPanning = tIsPanning;
		this.isPanningHeld = false;
		this.isSnapping = tIsSnapping;
		this.isStuffSelected = false;
	}
}

decorate( Selection,
	{
		isPanning: observable,
		isPanningHeld: observable,
		isSnapping: observable,
		isStuffSelected: observable
	}
);