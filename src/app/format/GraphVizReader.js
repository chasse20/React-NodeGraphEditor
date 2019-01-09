export default class GraphVizReader
{
	static Read( tModel, tJSON )
	{
		if ( tModel != null && tJSON != null )
		{
			GraphVizReader.ReadGraph( tModel.graph, tJSON.graph );
		}
	}
	
	static ReadGraph( tGraphModel, tJSON )
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
					tGraphModel.setNodeType( GraphVizReader.ReadType( tJSON[i], NodeModel.SerializableClasses, NodeView.SerializableClasses ) );
				}
			}
			
			// Edge Types
			if ( tJSON.edgeTypes != null )
			{
				const tempListLength = tJSON.edgeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					tGraphModel.setEdgeType( GraphVizReader.ReadType( tJSON[i], EdgeModel.SerializableClasses, EdgeView.SerializableClasses ) );
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
					let tempNodeJSON = tJSONnodes.[i];
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
	
	static ReadNode( tJSON, tTypes )
	{
		if ( tJSON != null && tTypes != null )
		{
			// Model class
			var tempType = tJSON.type == null ? null : tTypes[ tJSON.type ];
			if ( tempType == null )
			{
				tempType = tTypes[ "default" ];
			}
			
			const tempNode = new tempType._modelClass( tempType );
			
			// Position
			GraphVizReader.ReadVector( tNodeModel._position, tJSON.position );
			
			// Data
			if ( tJSON.data != null )
			{
				tNodeModel.data = Object.assign( tNodeModel.data, tJSON.data ); // merge/overwrite!
			}
			
			return tempNode;
		}
		
		return null;
	}
	
	static ReadNodePost( tNodeModel, tJSON, tNodeRefs, tEdgeTypes )
	{
		if ( tJSON != null && tJSON.pins !== undefined )
		{
			for ( let tempName in tJSON.pins )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin !== undefined )
				{
					GraphVizReader.ReadPinPost( tempPin, tJSON.pins[ tempName ], tNodeRefs, tEdgeTypes );
				}
			}
		}
	}
}