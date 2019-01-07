import { decorate, observable } from "mobx";

export default class Physics
{
	constructor( tIsEnabled = true )
	{
		this.isEnabled = tIsEnabled;
	}
}

decorate( Physics,
	{
		isEnabled: observable,
	}
);