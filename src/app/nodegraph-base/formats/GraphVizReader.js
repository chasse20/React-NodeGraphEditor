import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";
import Edge from "../models/Edge";
import Node from "../models/Node";
import EdgeView from "../views/graph/edges/Edge";
import NodeView from "../views/graph/nodes/Node";

export default class GraphVizReader
{
	read( tGraphModel, tJSON )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Position
			this.readVector( tGraphModel.position, tJSON.position );
			
			// Zoom
			if ( tJSON.zoom != null )
			{
				tGraphModel.zoom = tJSON.zoom;
			}
			
			// Node Types
			if ( tJSON.nodeTypes != null )
			{
				const tempListLength = tJSON.nodeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					tGraphModel.setNodeType( this.readNodeType( tJSON.nodeTypes[i] ) );
				}
			}
			
			// Edge Types
			if ( tJSON.edgeTypes != null )
			{
				const tempListLength = tJSON.edgeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					tGraphModel.setEdgeType( this.readEdgeType( tJSON.edgeTypes[i] ) );
				}
			}
			
			// Nodes
			if ( tJSON.nodes != null )
			{
				// Pre
				const tempNodeJSONs = {};
				const tempNodeRefs = {};
				const tempListLength = tJSON.nodes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					let tempNodeJSON = tJSON.nodes[i];
					let tempNode = this.readNode( tGraphModel, tempNodeJSON );
					if ( tGraphModel.setNode( tempNode ) )
					{
						tempNodeJSONs[ tempNode._id ] = tempNodeJSON;
						tempNodeRefs[ tempNodeJSON.id ] = tempNode;
					}
				}
				
				// Post with references
				for ( let tempID in tempNodeRefs )
				{
					this.readNodePost( tGraphModel, tempNodeRefs[ tempID ], tempNodeJSONs[ tempNodeRefs[ tempID ]._id ], tempNodeRefs );
				}
			}
		}
	}
	
	readVector( tVectorModel, tJSON )
	{
		if ( tJSON != null )
		{
			// X
			if ( tJSON.x != null )
			{
				tVectorModel.x = tJSON.x;
			}
			
			// Y
			if ( tJSON.y != null )
			{
				tVectorModel.y = tJSON.y;
			}
		}
	}
	
	readNodeType( tJSON, tSerializableModels = { "Node": Node }, tSerializableViews = { "Node": NodeView } )
	{
		if ( tJSON != null && tJSON.name != null )
		{
			// Classes
			const tempModelClass = tJSON.modelClass == null ? undefined : tSerializableModels[ tJSON.modelClass ];
			const tempViewClass = tJSON.viewClass == null ? undefined : tSerializableViews[ tJSON.viewClass ];
			
			return this.createNodeType( tJSON.name, tempModelClass, tempViewClass );
		}
		
		return null;
	}
	
	createNodeType( tName, tModelClass, tViewClass )
	{
		return new TypeNode( tName, tModelClass, tViewClass );
	}
	
	readEdgeType( tJSON, tSerializableModels = { "Edge": Edge }, tSerializableViews = { "Edge": EdgeView } )
	{
		if ( tJSON != null && tJSON.name != null )
		{
			// Classes
			const tempModelClass = tJSON.modelClass == null ? undefined : tSerializableModels[ tJSON.modelClass ];
			const tempViewClass = tJSON.viewClass == null ? undefined : tSerializableViews[ tJSON.viewClass ];
			
			return this.createEdgeType( tJSON.name, tempModelClass, tempViewClass );
		}
		
		return null;
	}
	
	createEdgeType( tName, tModelClass, tViewClass )
	{
		return new TypeEdge( tName, tModelClass, tViewClass );
	}
	
	readNode( tGraphModel, tJSON )
	{
		if ( tJSON != null )
		{
			// Node type
			var tempType = tJSON.type == null ? tGraphModel._nodeTypes[ "default" ] : tGraphModel._nodeTypes[ tJSON.type ];
			if ( tempType == null )
			{
				tempType = this.createNodeType();
				if ( !tGraphModel.setNodeType( tempType ) )
				{
					return null;
				}
			}
			
			const tempNode = this.createNode( tGraphModel, tempType );
			
			// Position
			this.readVector( tempNode.position, tJSON.position );
			
			return tempNode;
		}
		
		return null;
	}
	
	createNode( tGraphModel, tType )
	{
		return new tType._modelClass( tGraphModel, tType );
	}
	
	readNodePost( tGraphModel, tNodeModel, tJSON, tNodeRefs )
	{
		if ( tJSON.pins != null )
		{
			// Pins
			for ( let tempName in tJSON.pins )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin != null )
				{
					this.readPinPost( tGraphModel, tempPin, tJSON.pins[ tempName ], tNodeRefs );
				}
			}
		}
	}
	
	readPinPost( tGraphModel, tPinModel, tJSON, tNodeRefs )
	{
		if ( tPinModel._isOut && tJSON != null && tJSON.links != null )
		{
			for ( let i = ( tJSON.links.length - 1 ); i >= 0; --i )
			{
				tPinModel.setLink( this.readEdge( tGraphModel, tJSON.links[i], tPinModel, tNodeRefs ) );
			}
		}
	}
	
	readEdge( tGraphModel, tJSON, tSourcePin, tNodeRefs )
	{
		if ( tJSON != null && tJSON.node != null && tJSON.pin != null && tSourcePin != null && tNodeRefs != null )
		{
			// Target node and pin
			const tempTargetNode = tNodeRefs[ tJSON.node ];
			if ( tempTargetNode != null )
			{
				const tempTargetPin = tempTargetNode._pins[ tJSON.pin ];
				if ( tempTargetPin != null )
				{
					// Edge type
					var tempType = tJSON.type == null ? tGraphModel._edgeTypes[ "default" ] : tGraphModel._edgeTypes[ tJSON.type ];
					if ( tempType == null )
					{
						tempType = this.createEdgeType();
						if ( !tGraphModel.setEdgeType( tempType ) )
						{
							return null;
						}
					}

					return this.createEdge( tempType, tSourcePin, tempTargetPin );
				}
			}
		}
		
		return null;
	}
	
	createEdge( tType, tSourcePin, tTargetPin )
	{
		return new tType._modelClass( tType, tSourcePin, tTargetPin );
	}
}