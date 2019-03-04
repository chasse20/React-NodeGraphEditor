import { observable, decorate, values } from "mobx";
import Vector2D from "../../core/Vector2D";
import GUID from "../../core/GUID";
import Pin from "./Pin";

export default class Node
{
	constructor( tGraph, tType )
	{
		this._id = GUID.ID;
		this._graph = tGraph;
		this._type = tType;
		this._pins =
		{
			in: new Pin( "in", this, false ),
			out: new Pin( "out", this )
		};
		this.position = new Vector2D();
		this._isSelected = false;
	}
	
	clearLinks()
	{
		const tempPins = values( this._pins );
		for ( let i = ( tempPins.length - 1 ); i >= 0; --i )
		{
			tempPins[i].clearLinks();
		}
	}
	
	removeEdgesOfType( tType )
	{
		if ( tType != null )
		{
			const tempPins = values( this._pins );
			for ( let i = ( tempPins.length - 1 ); i >= 0; --i )
			{
				tempPins[i].removeEdgesOfType( tType );
			}
		}
	}
}

decorate( Node,
	{
		_pins: observable.shallow,
		position: observable,
		_isSelected: observable
	}
);