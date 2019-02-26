export default class GraphJSONWriter // TODO: Clustering
{
	write( tGraphModel, tNodeTextField = "caption", tEdgeTextField = "caption" )
	{
		if ( tGraphModel != null )
		{
			var tempJSON = null;
			
			// Nodes
			const tempEdges = [];
			for ( let tempID in tGraphModel._nodes )
			{
				let tempNode = this.writeNode( tGraphModel._nodes[ tempID ], tempEdges, tNodeTextField, tEdgeTextField );
				if ( tempNode != null )
				{
					if ( tempJSON === null )
					{
						tempJSON =
						{
							nodes: []
						};
					}
					
					tempJSON.nodes.push( tempNode );
				}
			}
			
			// Edges
			if ( tempJSON != null && tempEdges.length > 0 )
			{
				tempJSON.edges = tempEdges;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	writeNode( tNodeModel, tEdges, tNodeTextField = "caption", tEdgeTextField = "caption" )
	{
		const tempJSON =
		{
			id: tNodeModel._id
		};
		
		// Edges
		if ( tNodeModel._pins != null )
		{
			for ( let tempKey in tNodeModel._pins )
			{
				this.writePinEdges( tNodeModel._pins[ tempKey ], tEdges, tEdgeTextField );
			}
		}
		
		// Type
		if ( tNodeModel._type._name !== "default" )
		{
			tempJSON.type = tNodeModel._type._name;
		}
		
		return tempJSON;
	}
	
	writePinEdges( tPinModel, tEdges, tEdgeTextField = "caption" )
	{
		if ( tPinModel._isOut )
		{
			for ( let tempKey in tPinModel._links )
			{
				let tempEdge = this.writeEdge( tPinModel._links[ tempKey ], tEdgeTextField );
				if ( tempEdge != null )
				{
					tEdges.push( tempEdge );
				}
			}
		}
	}
	
	writeEdge( tEdgeModel, tEdgeTextField = "caption" )
	{
		const tempJSON =
		{
			source: tEdgeModel._source._node._id,
			target: tEdgeModel._target._node._id,
		};
		
		// Type
		if ( tEdgeModel._type._name !== "default" )
		{
			tempJSON[ tEdgeTextField ] = tEdgeModel._type._name;
		}
		
		return tempJSON;
	}
}