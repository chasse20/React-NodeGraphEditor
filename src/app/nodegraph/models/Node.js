import { observable, decorate } from "mobx";
import Vector2D from "../../core/Vector2D";
import GUID from "../../core/GUID";
import Pin from "./Pin";

export default class Node
{
	constructor( tType )
	{
		this._id = GUID.ID;
		this._type = tType;
		this._pins =
		{
			in: new Pin( this, false ),
			out: new Pin( this )
		};
		this.position = new Vector2D();
		this._isSelected = false;
	}
	
	removeEdgeType( tType )
	{
		if ( tType != null )
		{
			for ( let tempKey in this._pins )
			{
				this._pins[ tempKey ].removeEdgeType( tType );
			}
		}
	}
}

decorate( Node,
	{
		_pins: observable,
		position: observable,
		_isSelected: observable
	}
);