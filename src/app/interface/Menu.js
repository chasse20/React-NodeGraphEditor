import { decorate, observable } from "mobx";

export default class Menu
{
	constructor()
	{
		this.isOpen = false;
	}
}

decorate( Menu,
	{
		isOpen: observable
	}
);