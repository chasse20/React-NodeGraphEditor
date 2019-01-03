import Selection from "./Selection";
import Grid from "./Grid";

export default class Controls
{
	constructor()
	{
		this._selection = new Selection();
		this._grid = new Grid();
	}
}