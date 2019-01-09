export default class Edge
{
	static FromJSON( tJSON, tSourcePin, tNodeRefs, tTypes, tVersion )
	{
		if ( tJSON != null && tJSON.node != null && tJSON.pin != null && tSourcePin != null && tNodeRefs != null && tTypes != null )
		{
			// Target node and pin
			const tempTargetNode = tNodeRefs[ tJSON.node ];
			if ( tempTargetNode != null )
			{
				const tempTargetPin = tempTargetNode._pins[ tJSON.pin ];
				if ( tempTargetPin != null )
				{
					// Model class
					var tempType = tJSON.type == null ? null : tTypes[ tJSON.type ];
					if ( tempType == null )
					{
						tempType = tTypes[ "default" ];
					}

					const tempEdge = new tempType._modelClass( tempType, tSourcePin, tempTargetPin );
					Edge.Read( tempEdge, tJSON, tVersion );
					
					return tempEdge;
				}
			}
		}
		
		return null;
	}
	
	static Read( tEdgeModel, tJSON, tVersion )
	{
		if ( tEdgeModel != null && tJSON != null && tJSON.data != null )
		{
			tEdgeModel.data = Object.assign( tEdgeModel.data, tJSON.data ); // merge/overwrite!
		}
	}
	
	static Write( tEdgeModel )
	{
		if ( tEdgeModel != null )
		{
			var tempJSON =
			{
				node: tEdgeModel._target._node._id,
				pin: tEdgeModel._target._name,
				type: tEdgeModel._type._name
			};
			
			// Data
			for ( let tempKey in tEdgeModel.data )
			{
				tempJSON.data = tEdgeModel.data;
				break;
			}
			
			return tempJSON;
		}
		
		return null;
	}
}