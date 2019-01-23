import { decorate, observable, action } from "mobx";

export default class Options
{
	constructor( tIsPanMode = false, tIsGridVisible = true, tIsGridSnap = false, tIsPhysics = true )
	{
		this.isPanMode = tIsPanMode;
		this.isGridVisible = tIsGridVisible;
		this.isGridSnap = tIsGridSnap;
		this.isPhysics = tIsPhysics;
	}
}

decorate( Options,
	{
		isPanMode: observable,
		isGridVisible: observable,
		isGridSnap: observable,
		isPhysics: observable
	}
);