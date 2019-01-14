import TypeModel from "../nodegraph/Type";

export default class GraphJSONReader // TODO: Clustering
{
	static Read( tGraphModel, tJSON, tNodeTextField = "caption", tEdgeTextField = "caption" )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.nodes != null )
		{
			// Nodes
			const tempNodeRefs = {};
			var tempListLength = tJSON.nodes.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				let tempNodeJSON = tJSON.nodes[i];
				let tempNode = GraphJSONReader.ReadNode( tGraphModel, tempNodeJSON, tNodeTextField );
				if ( tGraphModel.setNode( tempNode ) )
				{
					tempNodeRefs[ tempNodeJSON.id ] = tempNode;
				}
			}
			
			// Edges
			if ( tJSON.edges != null )
			{
				tempListLength = tJSON.edges.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					GraphJSONReader.ReadEdge( tGraphModel, tJSON.edges[i], tempNodeRefs, tEdgeTextField );
				}
			}
		}
	}
	
	static ReadNode( tGraphModel, tJSON, tNodeTextField = "caption" )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Model class
			var tempType = null;
			if ( tJSON.type == null )
			{
				tempType = tGraphModel._nodeTypes[ "default" ];
			}
			else
			{
				tempType = tGraphModel._nodeTypes[ tJSON.type ];
				if ( tempType == null )
				{
					const tempDefaultType = tGraphModel._nodeTypes[ "default" ];
					tempType = new TypeModel( tJSON.type, tempDefaultType._modelClass, tempDefaultType._viewClass );
					tempType.data = Object.assign( tempType.data, tempDefaultType.data ); // TODO: Randomize colors????
					
					tGraphModel.setNodeType( tempType );
				}
			}
			
			const tempNode = new tempType._modelClass( tempType );
			
			// Data
			delete tJSON.type;
			var tempData = null;
			
			if ( tNodeTextField != null )
			{
				const tempText = tJSON[ tNodeTextField ];
				if ( tempText != null )
				{
					tempData =
					{
						text: tempText
					};
					
					delete tJSON[ tNodeTextField ];
				}
			}
			
			for ( let tempField in tJSON )
			{
				if ( tempField !== "id" )
				{
					if ( tempData === null )
					{
						tempData = {};
					}
					tempData[ tempField ] = tJSON[ tempField ];
				}
			}
			
			if ( tempData !== null )
			{
				tempNode.data = Object.assign( tempNode.data, tempData ); // merge/overwrite!
			}
			
			return tempNode;
		}
		
		return null;
	}
	
	static ReadEdge( tGraphModel, tJSON, tNodeRefs, tEdgeTextField = "caption" )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.source != null && tJSON.target != null && tNodeRefs != null )
		{
			// Source node
			const tempSourceNode = tNodeRefs[ tJSON.source ];
			if ( tempSourceNode != null )
			{
				// Target node
				const tempTargetNode = tNodeRefs[ tJSON.target ];
				if ( tempTargetNode != null )
				{
					// Model class
					const tempTypeName = tJSON[ tEdgeTextField ];
					var tempType = null;
					if ( tempTypeName == null )
					{
						tempType = tGraphModel._edgeTypes[ "default" ];
					}
					else
					{
						tempType = tGraphModel._edgeTypes[ tempTypeName ];
						if ( tempType === undefined )
						{
							const tempDefaultType = tGraphModel._edgeTypes[ "default" ];
							tempType = new TypeModel( tempTypeName, tempDefaultType._modelClass, tempDefaultType._viewClass );
							tempType.data = Object.assign( tempType.data, tempDefaultType.data ); // TODO: Randomize colors????
							tempType.data.text = tempTypeName;
							
							tGraphModel.setEdgeType( tempType );
						}
					}

					const tempSourcePin = tempSourceNode._pins.out;
					const tempEdge = new tempType._modelClass( tempType, tempSourcePin, tempTargetNode._pins.in );
					tempSourcePin.setLink( tempEdge );
					
					// Data
					delete tJSON.source;
					delete tJSON.target;
					var tempData = null;
					
					if ( tEdgeTextField != null )
					{
						delete tJSON[ tEdgeTextField ];
					}
					
					for ( let tempField in tJSON )
					{
						if ( tempData === null )
						{
							tempData = {};
						}
						tempData[ tempField ] = tJSON[ tempField ];
					}
					
					if ( tempData !== null )
					{
						tempEdge.data = Object.assign( tempEdge.data, tempData ); // merge/overwrite!
					}
					
					return tempEdge;
				}
			}
		}
		
		return null;
	}
}