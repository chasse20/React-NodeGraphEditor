import { observable, decorate, action, values } from "mobx";
import Transform2D from "../core/Transform2D";
import GUID from "../core/GUID";
import Pin from "./Pin";

export default class Node
{
	static SerializableClasses = { "Node": Node };
	
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
	
	static CreateFromJSON( tJSON, tTypes, tDefaultType )
	{
		if ( tJSON != null )
		{
			const tempNode = Node.CreateFromType( tJSON.type === undefined || tTypes == null ? tDefaultType : tTypes[ tJSON.type ] );
			if ( tempNode !== null )
			{
				tempNode.fromJSON( tJSON );
				
				return tempNode;
			}
		}
		
		return null;
	}
	
	toJSON()
	{
		const tempJSON =
		{
			id: this._id,
			type: this._type._name
		};

		// Transform
		const tempTransform = this._transform.toJSON();
		if ( tempTransform != null )
		{
			tempJSON.transform = tempTransform;
		}
		
		// Data
		for ( let tempKey in this.data )
		{
			tempJSON.data = this.data;
			break;
		}
		
		// Pins
		for ( let tempName in this._pins )
		{
			let tempPin = this._pins[ tempName ].toJSON();
			if ( tempPin != null )
			{
				if ( tempJSON.pins == null )
				{
					tempJSON.pins = {};
				}
				tempJSON.pins[ tempName ] = tempPin;

			}
		}
		
		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			// Transform
			this._transform.fromJSON( tJSON.transform );
			
			// Data
			if ( tJSON.data !== undefined )
			{
				this.data = Object.assign( this.data, tJSON.data ); // merge/overwrite!
			}
			
			// Pins
			if ( tJSON.pins !== undefined )
			{
				for ( let tempName in tJSON.pins )
				{
					let tempPin = this._pins[ tempName ];
					if ( tempPin !== undefined )
					{
						tempPin.fromJSON( tJSON.pins[ tempName ] );
					}
				}
			}
		}
	}
	
	fromJSONPost( tJSON, tNodeLoadRefs, tEdgeTypes, tDefaultEdgeType )
	{
		if ( tJSON != null && tJSON.pins !== undefined )
		{
			for ( let tempName in tJSON.pins )
			{
				let tempPin = this._pins[ tempName ];
				if ( tempPin !== undefined )
				{
					tempPin.fromJSONPost( tJSON.pins[ tempName ], tNodeLoadRefs, tEdgeTypes, tDefaultEdgeType );
				}
			}
		}
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
		isSelected: observable,
		fromJSON: action
	}
);