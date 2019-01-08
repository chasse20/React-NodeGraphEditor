import { observable, decorate, action, values } from "mobx";
import Transform2D from "../core/Transform2D";
import GUID from "../core/GUID";
import Pin from "./Pin";

export default class Node
{
	static SerializableClasses = { "default": Node, "Node": Node };
	
	constructor( tType, tData = {} )
	{
		this._id = GUID.ID;
		this._type = tType;
		this._pins =
		{
			in: new Pin( this, "in", undefined, false ),
			out: new Pin( this, "out" )
		};
		this._transform = new Transform2D();
		this.data = tData;
		this.isSelected = false;
	}
	
	static CreateFromType( tType, tData )
	{
		return tType == null ? null : new tType._modelClass( tType, tData );
	}
	
	removeEdgeType( tType )
	{
		if ( tType != null )
		{
			const tempPins = values( this._pins );
			for ( let i = ( tempPins.length - 1 ); i >= 0; --i )
			{
				tempPins[i].removeEdgeType( tType );
			}
		}
	}
}

decorate( Node,
	{
		_pins: observable,
		data: observable,
		isSelected: observable
	}
);