import Edge from "../models/Edge";
import Node from "../models/Node";
import Type from "../models/Type";
import EdgeView from "../views/graph/edge/Edge";
import NodeView from "../views/graph/node/Node";

export default class GraphVizReader
{
	static Read( tModel, tJSON )
	{
		if ( tModel != null && tJSON != null )
		{
			GraphVizReader.ReadGraph( tModel, tJSON );
		}
	}
	
	static ReadGraph( tGraphModel, tJSON )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Position
			GraphVizReader.ReadVector( tGraphModel.position, tJSON.position );
			
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
					tGraphModel.setNodeType( GraphVizReader.ReadType( tJSON.nodeTypes[i], tGraphModel._nodeTypes[ "default" ], NodeView.SerializableClasses ) );
				}
			}
			
			// Edge Types
			if ( tJSON.edgeTypes != null )
			{
				const tempListLength = tJSON.edgeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					tGraphModel.setEdgeType( GraphVizReader.ReadType( tJSON.edgeTypes[i], tGraphModel._edgeTypes[ "default" ], EdgeView.SerializableClasses ) );
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
					let tempNode = GraphVizReader.ReadNode( tempNodeJSON, tGraphModel._nodeTypes );
					if ( tGraphModel.setNode( tempNode ) )
					{
						tempNodeJSONs[ tempNode._id ] = tempNodeJSON;
						tempNodeRefs[ tempNodeJSON.id ] = tempNode;
					}
				}
				
				// Post with references
				for ( let tempID in tempNodeRefs )
				{
					GraphVizReader.ReadNodePost( tempNodeRefs[ tempID ], tempNodeJSONs[ tempNodeRefs[ tempID ]._id ], tempNodeRefs, tGraphModel._edgeTypes );
				}
			}
		}
	}
	
	static ReadVector( tVectorModel, tJSON )
	{
		if ( tVectorModel != null && tJSON != null )
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
	
	static ReadType( tJSON, tDefaultType, tSerializableViews )
	{
		if ( tJSON != null && tJSON.name != null && tSerializableViews != null )
		{
			// View class
			var tempViewClass = tJSON.viewClass == null ? null : tSerializableViews[ tJSON.viewClass ];
			if ( tempViewClass == null )
			{
				tempViewClass = tSerializableViews[ "default" ];
			}
			
			return new Type( tJSON.name, tempViewClass );
		}
		
		return null;
	}
	
	static ReadNode( tJSON, tTypes )
	{
		if ( tJSON != null && tTypes != null )
		{
			// Model class
			var tempType = null;
			if ( tJSON.type == null )
			{
				tempType = tTypes[ "default" ];
			}
			else
			{
				tempType = tTypes[ tJSON.type ];
			}
			
			const tempNode = new Node( tempType );
			
			// Position
			GraphVizReader.ReadVector( tempNode.position, tJSON.position );
			
			return tempNode;
		}
		
		return null;
	}
	
	static ReadNodePost( tNodeModel, tJSON, tNodeRefs, tEdgeTypes )
	{
		if ( tJSON != null && tJSON.pins != null )
		{
			// Pins
			for ( let tempName in tJSON.pins )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin != null )
				{
					GraphVizReader.ReadPinPost( tempPin, tJSON.pins[ tempName ], tNodeRefs, tEdgeTypes );
				}
			}
		}
	}
	
	static ReadPinPost( tPinModel, tJSON, tNodeRefs, tEdgeTypes )
	{
		if ( tPinModel != null && tPinModel._isOut && tJSON != null && tJSON.links != null && tNodeRefs != null )
		{
			for ( let i = ( tJSON.links.length - 1 ); i >= 0; --i )
			{
				tPinModel.setLink( GraphVizReader.ReadEdge( tJSON.links[i], tPinModel, tNodeRefs, tEdgeTypes ) );
			}
		}
	}
	
	static ReadEdge( tJSON, tSourcePin, tNodeRefs, tTypes )
	{
		if ( tJSON != null && tJSON.node != null && tJSON.pin != null && tSourcePin != null && tNodeRefs != null && tTypes != null )
		{
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
						tempType = tTypes[ "default" ];
					}
					else
					{
						tempType = tTypes[ tJSON.type ];
					}

					return new Edge( tempType, tSourcePin, tempTargetPin );
				}
			}
		}
		
		return null;
	}
}