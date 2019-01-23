import Edge from "../models/Edge";
import Node from "../models/Node";
import Type from "../models/Type";

export default class GraphSONReader
{
	read( tGraphModel, tJSON, tNodeTextField = "name", tEdgeTextField = "_label" )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.vertices != null )
		{
			// Vertics
			const tempNodeRefs = {};
			var tempListLength = tJSON.vertices.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				let tempNodeJSON = tJSON.vertices[i];
				let tempNode = this.readNode( tGraphModel, tempNodeJSON, tNodeTextField );
				if ( tGraphModel.setNode( tempNode ) )
				{
					tempNodeRefs[ tempNodeJSON._id ] = tempNode;
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
	
	readNode( tGraphModel, tJSON, tTextField = "name" )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Node type
			var tempType = null;
			if ( tJSON._type == null )
			{
				tempType = tGraphModel._nodeTypes[ "default" ];
			}
			else
			{
				tempType = tGraphModel._nodeTypes[ tJSON._type ];
				if ( tempType === undefined )
				{
					tempType = this.readNodeType( tJSON, tGraphModel._nodeTypes[ "default" ]._viewClass );
					tGraphModel.setNodeType( tempType );
				}
			}
			
			return this.createNode( tempType );
		}
		
		return null;
	}
	
	readNodeType( tJSON, tViewClass )
	{
		return this.createNodeType( tJSON._type, tViewClass );
	}
	
	createNodeType( tName, tViewClass )
	{
		return new Type( tName, tViewClass );
	}
	
	createNode( tType )
	{
		return new Node( tType );
	}
	
	readEdge( tGraphModel, tJSON, tNodeRefs, tTextField = "_label" )
	{
		if ( tGraphModel != null && tJSON != null && tJSON._outV != null && tJSON._inV != null && tNodeRefs != null )
		{
			// Source node
			const tempSourceNode = tNodeRefs[ tJSON._outV ];
			if ( tempSourceNode != null )
			{
				// Target node
				const tempTargetNode = tNodeRefs[ tJSON._inV ];
				if ( tempTargetNode != null )
				{
					// Model class
					var tempType = null;
					const tempTypeName = tJSON._type;
					if ( tempTypeName == null )
					{
						tempType = tGraphModel._edgeTypes[ "default" ];
					}
					else
					{
						tempType = tGraphModel._edgeTypes[ tempTypeName ];
						if ( tempType === undefined )
						{
							tempType = this.readEdgeType( tJSON, tGraphModel._edgeTypes[ "default" ]._viewClass, tTextField );
							tGraphModel.setEdgeType( tempType );
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
	
	readEdgeType( tJSON, tViewClass )
	{
		return this.createEdgeType( tJSON._type, tViewClass );
	}
	
	createEdgeType( tName, tViewClass )
	{
		return new Type( tName, tViewClass );
	}
	
	createEdge( tType, tSourcePin, tTargetPin )
	{
		return new Edge( tType, tSourcePin, tTargetPin );
	}
}