import { action, decorate, observable } from "mobx";

export default class Selection
{
	constructor( tIsPanning = true, tIsGridSnap = false)
	{
		this.isPanning = tIsPanning;
		this.isGridSnap = tIsGridSnap;
		this._selected = [];
	}

	toJSON()
	{
		var tempJSON = null;

		// Pan mode
		if ( this.isPanning !== false )
		{
			tempJSON =
			{
				isPanning: this.isPanning
			};
		}

		// Grid snap
		if ( this.isGridSnap !== true )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.isGridSnap = this.isGridSnap;
		}

		return tempJSON;
	}

	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			// Pan mode
			if ( tJSON.isPanning !== undefined )
			{
				this.isPanning = tJSON.isPanning;
			}
			
			// Grid snap
			if ( tJSON.isGridSnap !== undefined )
			{
				this.isGridSnap = tJSON.isGridSnap;
			}
		}
	}
}

decorate( Selection,
	{
		isPanning: observable,
		isGridSnap: observable,
		fromJSON: action
	}
);