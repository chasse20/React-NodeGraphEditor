import { decorate, observable } from "mobx";

export default class Menu
{
	constructor()
	{
		this.isOpen = false;
		this.openTab = 0;
	}
}

decorate( Menu,
	{
		isOpen: observable,
		openTab: observable
	}
);