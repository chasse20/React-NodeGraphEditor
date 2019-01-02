import { action, decorate, observable } from "mobx";

export default class Grid
{
	constructor( tSize = 80, tIsVisible = true )
	{
		this.size = tSize;
		this.isVisible = tIsVisible;
	}
	
	toJSON()
	{
		var tempJSON = null;

		// Size
		if ( this.size !== 80 )
		{
			tempJSON =
			{
				size: this.size
			};
		}

		// Visible
		if ( this.isVisible !== true )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.isVisible = this.isVisible;
		}

		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			// Size
			if ( tJSON.size !== undefined )
			{
				this.size = tJSON.size;
			}
			
			// Visible
			if ( tJSON.isVisible !== undefined )
			{
				this.isVisible = tJSON.isVisible;
			}
		}
	}
}

decorate( Grid,
	{
		size: observable,
		isVisible: observable,
		fromJSON: action
	}
);