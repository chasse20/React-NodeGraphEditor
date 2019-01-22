import Edge from "../models/Edge";
import Node from "../models/Node";
import Type from "../models/Type";

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
		return this.createNodeType( tJSON.type, tViewClass );
	}
	
	createNodeType( tName, tViewClass )
	{
		return new Type( tName, tViewClass );
	}
	
	createNode( tType )
	{
		return new Node( tType );
	}
	
	readEdge( tGraphModel, tJSON, tNodeRefs, tTextField = "caption" )
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
					const tempTypeName = tJSON[ tTextField ];
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
	
	readEdgeType( tJSON, tViewClass, tTextField = "caption" )
	{
		return this.createEdgeType( tJSON[ tTextField ], tViewClass );
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