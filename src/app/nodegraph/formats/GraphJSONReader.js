import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";

export default class GraphJSONReader // TODO: Clustering
{
	read( tGraphModel, tJSON, tNodeTextField = "caption", tEdgeTextField = "caption" )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.nodes != null )
		{
			// Nodes
			const tempNodeRefs = {};
			var tempListLength = tJSON.nodes.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				let tempNodeJSON = tJSON.nodes[i];
				let tempNode = this.readNode( tGraphModel, tempNodeJSON, tNodeTextField );
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
					this.readEdge( tGraphModel, tJSON.edges[i], tempNodeRefs, tEdgeTextField );
				}
			}
		}
	}
	
	readNode( tGraphModel, tJSON, tTextField = "caption" )
	{
		if ( tJSON != null )
		{
			// Node type
			var tempType = tJSON.type == null ? tGraphModel._nodeTypes[ "default" ] : tGraphModel._nodeTypes[ tJSON.type ];
			if ( tempType == null )
			{
				tempType = this.readNodeType( tJSON );
				if ( !tGraphModel.setNodeType( tempType ) )
				{
					return null;
				}
			}
			
			return this.createNode( tempType );
		}
		
		return null;
	}
	
	readNodeType( tJSON )
	{
		return this.createNodeType( tJSON.type );
	}
	
	createNodeType( tName, tModelClass, tViewClass )
	{
		return new TypeNode( tName, tModelClass, tViewClass );
	}
	
	createNode( tType )
	{
		return new tType._modelClass( tType );
	}
	
	readEdge( tGraphModel, tJSON, tNodeRefs, tTextField = "caption" )
	{
		if ( tJSON != null && tJSON.source != null && tJSON.target != null )
		{
			// Source node
			const tempSourceNode = tNodeRefs[ tJSON.source ];
			if ( tempSourceNode != null )
			{
				// Target node
				const tempTargetNode = tNodeRefs[ tJSON.target ];
				if ( tempTargetNode != null )
				{
					// Edge type
					const tempTypeName = tJSON[ tTextField ];
					var tempType = tempTypeName == null ? tGraphModel._edgeTypes[ "default" ] : tGraphModel._edgeTypes[ tempTypeName ];
					if ( tempType == null )
					{
						tempType = this.readEdgeType( tJSON, tTextField );
						if ( !tGraphModel.setEdgeType( tempType ) )
						{
							return null;
						}
					}

					const tempSourcePin = tempSourceNode._pins.out;
					const tempEdge = this.createEdge( tempType, tempSourcePin, tempTargetNode._pins.in );
					tempSourcePin.setLink( tempEdge );
					
					return tempEdge;
				}
			}
		}
		
		return null;
	}
	
	readEdgeType( tJSON, tTextField = "caption" )
	{
		return this.createEdgeType( tJSON[ tTextField ] );
	}
	
	createEdgeType( tName, tModelClass, tViewClass )
	{
		return new TypeEdge( tName, tModelClass, tViewClass );
	}
	
	createEdge( tType, tSourcePin, tTargetPin )
	{
		return new tType._modelClass( tType, tSourcePin, tTargetPin );
	}
}