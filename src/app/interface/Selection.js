import { decorate, observable } from "mobx";

export default class Selection
{
	constructor( tIsPanMode = false, tIsSnapMode = false, tSnapIncrement = 5 )
	{
		this.isPanMode = tIsPanMode;
		this.isPanningHeld = false;
		this.isSnapMode = tIsSnapMode;
		this.snapIncrement = tSnapIncrement;
		this.isStuffSelected = false;
		this.isMarqueeHeld = false;
	}
}

decorate( Selection,
	{
		isPanMode: observable,
		isPanningHeld: observable,
		isSnapMode: observable,
		isStuffSelected: observable,
		isMarqueeHeld: observable
	}
);