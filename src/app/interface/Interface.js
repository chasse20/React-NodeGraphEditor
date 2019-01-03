import Controls from "./Controls";
import Menu from "./Menu";

export default class Interface
{
	constructor()
	{
		this._controls = new Controls();
		this._menu = new Menu();
	}
}