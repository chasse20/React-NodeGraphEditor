import { observable, decorate, action, values } from "mobx";
import Vector2D from "../core/Vector2D";
import GUID from "../core/GUID";
import Pin from "./Pin";

export default class Node
{
	static SerializableClasses = { "default": Node, "Node": Node };
	
	constructor( tType, tPosition = new Vector2D(), tData = {} )
	{
		this._id = GUID.ID;
		this._type = tType;
		this._pins =
		{
			in: new Pin( this, false ),
			out: new Pin( this )
		};
		this._position = tPosition;
		this.data = tData;
		this.isSelected = false;
	}
	
	static CreateFromType( tType, tPosition = new Vector2D(), tData )
	{
		return tType == null ? null : new tType._modelClass( tType, tPosition, tData );
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
		_position: observable,
		data: observable,
		isSelected: observable
	}
);