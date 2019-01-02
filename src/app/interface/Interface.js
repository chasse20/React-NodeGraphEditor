import Selection from "./Selection";
import Zoom from "./Zoom";
import Grid from "./Grid";

export default class Interface
{
	constructor()
	{
		this._selection = new Selection();
		this._grid = new Grid();
		this._zoom = new Zoom();
	}
	
	toJSON()
	{
		var tempJSON = null;
		
		// Selection
		var tempObject = this._selection.toJSON();
		if ( tempObject != null )
		{
			tempJSON =
			{
				selection: tempObject
			};
		}
		
		// Zoom
		tempObject = this._zoom.toJSON();
		if ( tempObject != null )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.zoom = tempObject;
		}
		
		// Grid
		tempObject = this._grid.toJSON();
		if ( tempObject != null )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.grid = tempObject;
		}
		
		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			this._selection.fromJSON( tJSON.selection );
			this._zoom.fromJSON( tJSON.zoom );
			this._grid.fromJSON( tJSON.grid );
		}
	}
}