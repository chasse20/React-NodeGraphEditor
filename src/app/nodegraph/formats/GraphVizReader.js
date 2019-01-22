import Edge from "../models/Edge";
import Node from "../models/Node";
import Type from "../models/Type";
import EdgeView from "../views/graph/edge/Edge";
import NodeView from "../views/graph/node/Node";

export default class GraphVizReader
{
	read( tModel, tJSON )
	{
		if ( tModel != null && tJSON != null )
		{
			this.readGraph( tModel, tJSON );
		}
	}
	
	readGraph( tGraphModel, tJSON )
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
					tGraphModel.setNodeType( this.readNodeType( tJSON.nodeTypes[i], tGraphModel._nodeTypes[ "default" ] ) );
				}
			}
			
			// Edge Types
			if ( tJSON.edgeTypes != null )
			{
				const tempListLength = tJSON.edgeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					tGraphModel.setEdgeType( this.readEdgeType( tJSON.edgeTypes[i], tGraphModel._edgeTypes[ "default" ] ) );
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
					let tempNode = this.readNode( tempNodeJSON, tGraphModel._nodeTypes );
					if ( tGraphModel.setNode( tempNode ) )
					{
						tempNodeJSONs[ tempNode._id ] = tempNodeJSON;
						tempNodeRefs[ tempNodeJSON.id ] = tempNode;
					}
				}
				
				// Post with references
				for ( let tempID in tempNodeRefs )
				{
					this.readNodePost( tempNodeRefs[ tempID ], tempNodeJSONs[ tempNodeRefs[ tempID ]._id ], tempNodeRefs, tGraphModel._edgeTypes );
				}
			}
		}
	}
	
	readVector( tVectorModel, tJSON )
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
	
	readNodeType( tJSON, tDefaultType, tSerializableViews = { "default": NodeView, "Node": NodeView } )
	{
		if ( tJSON != null && tJSON.name != null && tSerializableViews != null )
		{
			// View class
			var tempViewClass = tJSON.viewClass == null ? null : tSerializableViews[ tJSON.viewClass ];
			if ( tempViewClass == null )
			{
				tempViewClass = tSerializableViews[ "default" ];
			}
			
			return this.createNodeType( tJSON.name, tempViewClass );
		}
		
		return null;
	}
	
	createNodeType( tName, tViewClass )
	{
		return new Type( tName, tViewClass );
	}
	
	readEdgeType( tJSON, tDefaultType, tSerializableViews = { "default": EdgeView, "Edge": EdgeView } )
	{
		if ( tJSON != null && tJSON.name != null && tSerializableViews != null )
		{
			// View class
			var tempViewClass = tJSON.viewClass == null ? null : tSerializableViews[ tJSON.viewClass ];
			if ( tempViewClass == null )
			{
				tempViewClass = tSerializableViews[ "default" ];
			}
			
			return this.createEdgeType( tJSON.name, tempViewClass );
		}
		
		return null;
	}
	
	createEdgeType( tName, tViewClass )
	{
		return new Type( tName, tViewClass );
	}
	
	readNode( tJSON, tTypes )
	{
		if ( tJSON != null && tTypes != null )
		{
			// Type
			var tempType = tJSON.type == null ? null : tTypes[ tJSON.type ];
			if ( tempType == null )
			{
				tempType = tTypes[ "default" ];
			}
			
			const tempNode = this.createNode( tempType );
			
			// Position
			this.readVector( tempNode.position, tJSON.position );
			
			return tempNode;
		}
		
		return null;
	}
	
	createNode( tType )
	{
		return new Node( tType );
	}
	
	readNodePost( tNodeModel, tJSON, tNodeRefs, tEdgeTypes )
	{
		if ( tJSON != null && tJSON.pins != null )
		{
			// Pins
			for ( let tempName in tJSON.pins )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin != null )
				{
					this.readPinPost( tempPin, tJSON.pins[ tempName ], tNodeRefs, tEdgeTypes );
				}
			}
		}
	}
	
	readPinPost( tPinModel, tJSON, tNodeRefs, tEdgeTypes )
	{
		if ( tPinModel != null && tPinModel._isOut && tJSON != null && tJSON.links != null && tNodeRefs != null )
		{
			for ( let i = ( tJSON.links.length - 1 ); i >= 0; --i )
			{
				tPinModel.setLink( this.readEdge( tJSON.links[i], tPinModel, tNodeRefs, tEdgeTypes ) );
			}
		}
	}
	
	readEdge( tJSON, tSourcePin, tNodeRefs, tTypes )
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
					// Type
					var tempType = tJSON.type == null ? null : tTypes[ tJSON.type ];
					if ( tempType == null )
					{
						tempType = tTypes[ "default" ];
					}

					return this.createEdge( tempType, tSourcePin, tempTargetPin );
				}
			}
		}
		
		return null;
	}
	
	createEdge( tType, tSourcePin, tTargetPin )
	{
		return new Edge( tType, tSourcePin, tTargetPin );
	}
}