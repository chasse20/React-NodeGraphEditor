import { observable, decorate } from "mobx";
import Vector2D from "../core/Vector2D";
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
			in: new Pin( this, false ),
			out: new Pin( this )
		};
		this.position = new Vector2D();
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
		data: observable,
		isSelected: observable
	}
);