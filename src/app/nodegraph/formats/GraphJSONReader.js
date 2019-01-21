import Edge from "../models/Edge";
import Node from "../models/Node";
import Type from "../models/Type";

export default class GraphJSONReader // TODO: Clustering
{
	static Read( tGraphModel, tJSON )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.nodes != null )
		{
			// Nodes
			const tempNodeRefs = {};
			var tempListLength = tJSON.nodes.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				let tempNodeJSON = tJSON.nodes[i];
				let tempNode = GraphJSONReader.ReadNode( tGraphModel, tempNodeJSON );
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
					GraphJSONReader.ReadEdge( tGraphModel, tJSON.edges[i], tempNodeRefs );
				}
			}
		}
	}
	
	static ReadNode( tGraphModel, tJSON )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Node type
			var tempType = null;
			if ( tJSON.type == null )
			{
				tempType = tGraphModel._nodeTypes[ "default" ];
			}
			else
			{
				tempType = tGraphModel._nodeTypes[ tJSON.type ];
				if ( tempType === undefined )
				{
					tempType = new Type( tJSON.type, tGraphModel._nodeTypes[ "default" ]._viewClass );
					
					tGraphModel.setNodeType( tempType );
				}
			}
			
			return new Node( tempType );
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
					var tempType = null;
					const tempTypeName = tJSON[ tEdgeTextField ];
					if ( tempTypeName == null )
					{
						tempType = tGraphModel._edgeTypes[ "default" ];
					}
					else
					{
						tempType = tGraphModel._edgeTypes[ tempTypeName ];
						if ( tempType === undefined )
						{
							tempType = new Type( tempTypeName, tGraphModel._edgeTypes[ "default" ]._viewClass );
							
							tGraphModel.setEdgeType( tempType );
						}
					}

					const tempSourcePin = tempSourceNode._pins.out;
					const tempEdge = new Edge( tempType, tempSourcePin, tempTargetNode._pins.in );
					tempSourcePin.setLink( tempEdge );
					
					return tempEdge;
				}
			}
		}
		
		return null;
	}
}