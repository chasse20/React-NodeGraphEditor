/**
*	Writer factory for the GraphJSON format
*	@memberof nodegraph-base
*/
export default class GraphJSONWriter // TODO: Clustering
{
	/**
	*	Writes GraphJSON from a graph model
	*	@param {Graph} tGraphModel Graph model to write data from
	*	@param {string} [tNodeTextField=caption] Which field name should be considered as the visible text label of a node
	*	@param {string} [tEdgeTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {Object} GraphJSON output
	*/
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
	
	/**
	*	Writes JSON from a node model
	*	@param {Node} tNodeModel Node model to write data from
	*	@param {Object[]} tEdges Array of edges to write individual JSON to
	*	@param {string} [tNodeTextField=caption] Which field name should be considered as the visible text label of a node
	*	@param {string} [tEdgeTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {Object} JSON output
	*/
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
	
	/**
	*	Writes JSON edges from a pin model
	*	@param {Pin} tPinModel Pin model to write data from
	*	@param {Object[]} tEdges Array of edges to write individual JSON to
	*	@param {string} [tEdgeTextField=caption] Which field name should be considered as the visible text label of an edge
	*/
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
	
	/**
	*	Writes JSON from an edge model
	*	@param {Edge} tEdgeModel Edge model to write data from
	*	@param {string} [tEdgeTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {Object} JSON output
	*/
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