import NodeModel from "../nodegraph/Node";
import NodeView from "../nodegraph/views/Node";
import EdgeModel from "../nodegraph/Edge";
import EdgeView from "../nodegraph/views/Edge";
import TypeModel from "../nodegraph/Type";

export default class GraphVizReader
{
	static Read( tGraphModel, tJSON )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Transform
			GraphVizReader.ReadTransform( tGraphModel._transform, tJSON.transform );
			
			// Node Types
			if ( tJSON.nodeTypes != null )
			{
				const tempListLength = tJSON.nodeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					let tempType = GraphVizReader.ReadType( tJSON.nodeTypes[i], NodeModel.SerializableClasses, NodeView.SerializableClasses );
					if ( tempType != null )
					{
						tGraphModel.setNodeType( tJSON.nodeTypes[i].name, tempType );
					}
				}
			}
			
			// Edge Types
			if ( tJSON.edgeTypes != null )
			{
				const tempListLength = tJSON.edgeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					let tempType = GraphVizReader.ReadType( tJSON.edgeTypes[i], EdgeModel.SerializableClasses, EdgeView.SerializableClasses );
					if ( tempType != null )
					{
						tGraphModel.setEdgeType( tJSON.edgeTypes[i].name, tempType );
					}
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
					let tempNode = GraphVizReader.ReadNode( tGraphModel, tempNodeJSON );
					if ( tGraphModel.setNode( tempNode ) )
					{
						tempNodeJSONs[ tempNode._id ] = tempNodeJSON;
						tempNodeRefs[ tempNodeJSON.id ] = tempNode;
					}
				}
				
				// Post with references
				for ( let tempID in tempNodeRefs )
				{
					GraphVizReader.ReadNodePost( tGraphModel, tempNodeRefs[ tempID ], tempNodeJSONs[ tempNodeRefs[ tempID ]._id ], tempNodeRefs );
				}
			}
		}
	}
	
	static ReadTransform( tTransformModel, tJSON )
	{
		if ( tTransformModel != null && tJSON != null )
		{
			// Position
			GraphVizReader.ReadVector( tTransformModel._position, tJSON.position );
			
			// Rotation
			if ( tJSON.rotation != null )
			{
				tTransformModel._rotation = tJSON.rotation;
			}
			
			// Scale
			GraphVizReader.ReadVector( tTransformModel._scale, tJSON.scale );
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
	
	static ReadType( tJSON, tSerializableModels, tSerializableViews )
	{
		if ( tJSON != null && tJSON.name != null && tSerializableModels != null && tSerializableViews != null )
		{
			// Model class
			var tempModelClass = tJSON.modelClass == null ? null : tSerializableModels[ tJSON.modelClass ];
			if ( tempModelClass == null )
			{
				tempModelClass = tSerializableModels[ "default" ];
			}
			
			// View class
			var tempViewClass = tJSON.viewClass == null ? null : tSerializableViews[ tJSON.viewClass ];
			if ( tempViewClass == null )
			{
				tempViewClass = tSerializableViews[ "default" ];
			}
			
			const tempType = new TypeModel( tempModelClass, tempViewClass );
			
			// Data
			if ( tJSON.data != null )
			{
				tempType.data = Object.assign( tempType.data, tJSON.data );
			}
			
			return tempType;
		}
		
		return null;
	}
	
	static ReadNode( tGraphModel, tJSON )
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
					tempType = new TypeModel( tempDefaultType._modelClass, tempDefaultType._viewClass );
					tempType.data = Object.assign( tempType.data, tempDefaultType.data ); // TODO: Randomize colors????
					
					tGraphModel.setNodeType( tJSON.type, tempType );
				}
			}
			
			const tempNode = new tempType._modelClass( tempType );
			
			// Position
			GraphVizReader.ReadVector( tempNode._position, tJSON.position );
			
			// Data
			if ( tJSON.data != null )
			{
				tempNode.data = Object.assign( tempNode.data, tJSON.data ); // merge/overwrite!
			}
			
			return tempNode;
		}
		
		return null;
	}
	
	static ReadNodePost( tGraphModel, tNodeModel, tJSON, tNodeRefs )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.pins != null )
		{
			// Pins
			for ( let tempName in tJSON.pins )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin != null )
				{
					GraphVizReader.ReadPinPost( tGraphModel, tempPin, tJSON.pins[ tempName ], tNodeRefs );
				}
			}
		}
	}
	
	static ReadPinPost( tGraphModel, tPinModel, tJSON, tNodeRefs )
	{
		if ( tGraphModel != null && tPinModel != null && tPinModel._isOut && tJSON != null && tJSON.links != null && tNodeRefs != null )
		{
			for ( let i = ( tJSON.links.length - 1 ); i >= 0; --i )
			{
				tPinModel.setLink( GraphVizReader.ReadEdge( tGraphModel, tJSON.links[i], tPinModel, tNodeRefs ) );
			}
		}
	}
	
	static ReadEdge( tGraphModel, tJSON, tSourcePin, tNodeRefs )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.node != null && tJSON.pin != null && tSourcePin != null && tNodeRefs != null )
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
						tempType = tGraphModel._edgeTypes[ "default" ];
					}
					else
					{
						tempType = tGraphModel._edgeTypes[ tJSON.type ];
						if ( tempType == null )
						{
							const tempDefaultType = tGraphModel._edgeTypes[ "default" ];
							tempType = new TypeModel( tempDefaultType._modelClass, tempDefaultType._viewClass );
							tempType.data = Object.assign( tempType.data, tempDefaultType.data ); // TODO: Randomize colors????
							
							tGraphModel.setEdgeType( tJSON.type, tempType );
						}
					}

					const tempEdge = new tempType._modelClass( tempType, tSourcePin, tempTargetPin );
					
					// Data
					if ( tJSON.data != null )
					{
						tempEdge.data = Object.assign( tempEdge.data, tJSON.data ); // merge/overwrite!
					}
					
					return tempEdge;
				}
			}
		}
		
		return null;
	}
}