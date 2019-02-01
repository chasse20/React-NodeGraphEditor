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
			if ( tempEdges.length > 0 )
			{
				tempJSON.edges = tempEdges;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	writeNode( tNodeModel, tEdges, tNodeTextField = "caption", tEdgeTextField = "caption" )
	{
		if ( tNodeModel != null )
		{
			// Edges
			if ( tNodeModel._pins != null && tEdges != null )
			{
				for ( let tempKey in tNodeModel._pins )
				{
					this.writePinEdges( tNodeModel._pins[ tempKey ], tEdges, tEdgeTextField );
				}
			}
			
			// Node
			return {
				id: tNodeModel._id,
				type: tNodeModel._type._name
			};
		}
		
		return null;
	}
	
	writePinEdges( tPinModel, tEdges, tEdgeTextField = "caption" )
	{
		if ( tPinModel != null && tPinModel._isOut && tEdges != null )
		{
			for ( let tempKey in tPinModel._links )
			{
				let tempEdge = this.writeEdge( tPinModel._links[ tempKey ], tEdges, tEdgeTextField );
				if ( tempEdge != null )
				{
					tEdges.push( tempEdge );
				}
			}
		}
	}
	
	writeEdge( tEdgeModel, tEdgeTextField = "caption" )
	{
		if ( tEdgeModel != null )
		{
			// Edge
			return {
				source: tEdgeModel._source._node._id,
				target: tEdgeModel._target._node._id,
				type: tEdgeModel._type._name
			};
		}
		
		return null;
	}
}