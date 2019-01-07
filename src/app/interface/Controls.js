import Selection from "./Selection";
import Grid from "./Grid";
import Physics from "./Physics";

export default class Controls
{
	constructor()
	{
		this._selection = new Selection();
		this._grid = new Grid();
		this._physics = new Physics();
	}
}