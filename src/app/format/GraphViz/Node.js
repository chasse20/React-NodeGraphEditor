import NodeModel from "../../nodegraph/Node";

export default class Node
{
	static FromJSON( tJSON, tTypes, tVersion )
	{
		if ( tJSON != null && tTypes != null )
		{
			// Model class
			var tempType = tJSON.type == null ? null : tTypes[ tJSON.type ];
			if ( tempType == null )
			{
				tempType = tTypes[ "default" ];
			}
			
			const tempNode = new tempType._modelClass( tempType );
			return Node.Read( tempNode, tJSON, tVersion );
			
			return tempNode;
		}
		
		return null;
	}
	
	static Read( tNodeModel, tJSON, tVersion )
	{
		if ( tNodeModel != null && tJSON != null )
		{
			// Transform
			Transform2D.Read( tNodeModel._transform, tJSON.transform, tVersion );
			
			// Data
			if ( tJSON.data != null )
			{
				tNodeModel.data = Object.assign( tNodeModel.data, tJSON.data ); // merge/overwrite!
			}
			
			// Pins
			Node.ReadPins( tNodeModel, tJSON.pins, tVersion );
		}
	}
	
	static ReadPins( tNodeModel, tJSON, tVersion )
	{
		if ( tJSON != null )
		{
			for ( let tempName in tJSON )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin !== undefined )
				{
					Pin.Read( tempPin, tJSON[ tempName ], tVersion );
				}
			}
		}
	}
	
	static ReadPost( tNodeModel, tJSON, tNodeRefs, tEdgeTypes, tVersion )
	{
		if ( tJSON != null && tJSON.pins !== undefined )
		{
			for ( let tempName in tJSON.pins )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin !== undefined )
				{
					Pin.ReadPost( tempPin, tJSON.pins[ tempName ], tNodeRefs, tEdgeTypes, tVersion );
				}
			}
		}
	}
	
	static Write( tNodeModel )
	{
		if ( tNodeModel != null )
		{
			var tempJSON =
			{
				id: tNodeModel._id,
				type: tNodeModel._type._name
			};
			
			// Transform
			const tempTransform = Transform2D.Write( tGraphModel._transform );
			if ( tempTransform != null )
			{
				tempJSON = { transform: tempTransform };
			}
			
			// Data
			for ( let tempKey in tNodeModel.data )
			{
				tempJSON.data = tNodeModel.data;
				break;
			}
			
			// Pins
			const tempPins = Node.WritePins( tNodeModel._pins );
			if ( tempPins != null )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.pins = tempPins;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WritePins( tPins )
	{
		if ( tPins != null )
		{
			var tempJSON = null;
			for ( let tempName in tPins )
			{
				let tempPin = Pin.Write( tPins[ tempName ] );
				if ( tempPin != null )
				{
					if ( tempJSON === null )
					{
						tempJSON = {};
					}
					
					tempJSON[ tempName ] = tempPin;
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
}