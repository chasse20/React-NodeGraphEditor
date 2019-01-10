import NodeModel from "../nodegraph/Node";
import NodeView from "../nodegraph/views/Node";
import EdgeModel from "../nodegraph/Edge";
import EdgeView from "../nodegraph/views/Edge";
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
				let tempNode = GraphVizReader.ReadNode( tGraphModel, tempNodeJSON, tNodeTextField );
				if ( tGraphModel.setNode( tempNode ) )
				{
					tempNodeRefs[ tempNodeJSON.id ] = tempNode;
				}
			}
			
			// Edges
			if ( tJSON.edges != null )
			{
				var tempListLength = tJSON.edges.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					GraphVizReader.ReadEdge( tGraphModel, tJSON.edges[i], tempNodeRefs, tEdgeTextField );
				}
			}
		}
	}
	
	static ReadNode( tGraphModel, tJSON, tNodeTextField = "caption" )
	{
		if ( tGraphModel != null && tJSON != null && tTypes != null )
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
					tempType = new TypeModel( tempDefaultType._modelClass, tempDefaultType._viewClass );
					tempType.data = Object.assign( tempType.data, tempDefaultType.data ); // TODO: Randomize colors????
					
					tGraphModel.setNodeType( tJSON.type, tempType );
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
					
				}
			}
			
			// Target node and pin
			const tempTargetNode = tNodeRefs[ tJSON.node ];
			if ( tempTargetNode != null )
			{
				const tempTargetPin = tempTargetNode._pins[ tJSON.pin ];
				if ( tempTargetPin != null )
				{
					// Model class
					var tempType = null;
					if ( tJSON.type == null )
					{
						tempType = tGraphModel._edgeTypes[ "default" ];
					}
					else
					{
						tempType = tGraphModel._edgeTypes[ tJSON.type ];
						if ( tempType === undefined )
						{
							const tempDefaultType = tGraphModel._edgeTypes[ "default" ];
							tempType = new TypeModel( tempDefaultType._modelClass, tempDefaultType._viewClass );
							tempType.data = Object.assign( tempType.data, tempDefaultType.data ); // TODO: Randomize colors????
							
							tGraphModel.setEdgeType( tJSON.type, tempType );
						}
					}

					const tempEdge = new tempType._modelClass( tempType, tSourcePin, tempTargetPin );
					
					// Data
					delete tJSON.type;
					delete tJSON.source;
					delete tJSON.target;
					var tempData = null;
					
					if ( tEdgeTextField != null )
					{
						const tempText = tJSON[ tEdgeTextField ];
						if ( tempText != null )
						{
							tempData =
							{
								text: tempText
							};
							
							delete tJSON[ tEdgeTextField ];
						}
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
						tempNode.data = Object.assign( tempNode.data, tempData ); // merge/overwrite!
					}
					
					return tempEdge;
				}
			}
		}
		
		return null;
	}
}