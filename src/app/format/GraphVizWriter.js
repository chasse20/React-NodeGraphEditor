export default class GraphVizWriter
{
	static Write( tModel )
	{
		if ( tModel != null )
		{
			const tempJSON =
			{
				version: 1
			};
			
			// Graph
			const tempGraph = GraphVizWriter.WriteGraph( tModel.graph );
			if ( tempGraph != null )
			{
				tempJSON.graph = tempGraph;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteGraph( tGraphModel )
	{
		if ( tGraphModel != null )
		{
			var tempJSON = null;
			
			// Transform
			const tempTransform = GraphVizWriter.WriteTransform( tGraphModel._transform );
			if ( tempTransform != null )
			{
				tempJSON = { transform: tempTransform };
			}
			
			// Node types
			var tempArray = GraphVizWriter.WriteTypes( tGraphModel._nodeTypes, NodeModel.SerializableClasses, NodeView.SerializableClasses );
			if ( tempArray != null )
			{
				if ( tempJSON == null )
				{
					tempJSON = {};
				}
				tempJSON.nodeTypes = tempArray;
			}
			
			// Edge types
			tempArray = GraphVizWriter.WriteTypes( tGraphModel._edgeTypes, EdgeModel.SerializableClasses, EdgeView.SerializableClasses );
			if ( tempArray != null )
			{
				if ( tempJSON == null )
				{
					tempJSON = {};
				}
				tempJSON.edgeTypes = tempArray;
			}
			
			// Nodes
			for ( let tempKey in tGraphModel._nodes )
			{
				if ( tempJSON == null )
				{
					tempJSON = {};
				}
				
				if ( tempJSON.nodes == null )
				{
					tempJSON.nodes = [];
				}
				
				tempJSON.nodes.push( GraphVizWriter.WriteNode( tGraphModel._nodes[ tempKey ], tGraphModel._nodeTypes, tGraphModel._edgeTypes ) );
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteTransform( tTransformModel )
	{
		if ( tTransformModel != null )
		{
			var tempJSON = null;
			
			// Position
			const tempPosition = GraphVizWriter.WriteVector( tTransformModel._position );
			if ( tempPosition != null )
			{
				tempJSON = { position: tempPosition };
			}
			
			// Rotation
			if ( tTransformModel._rotation !== 0 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.rotation = tTransformModel._rotation;
			}
			
			// Scale
			if ( !Vector2DModel.IsOne( tTransformModel._scale ) )
			{
				const tempScale = GraphVizWriter.WriteVector( tTransformModel_scale );
				if ( tempScale != null )
				{
					if ( tempJSON === null )
					{
						tempJSON = {};
					}
					tempJSON.scale = {};
					
					if ( tempScale.x !== 1 )
					{
						tempJSON.scale.x = tempScale.x;
					}
					
					if ( tempScale.y !== 1 )
					{
						tempJSON.scale.y = tempScale.y;
					}
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteVector( tVectorModel )
	{
		if ( tVectorModel != null )
		{
			var tempJSON = null;
			
			// X
			if ( tVectorModel.x !== 0 )
			{
				tempJSON = { x: tVectorModel.x };
			}
			
			// Y
			if ( tVectorModel.y !== 0 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.y = tVectorModel.y;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteTypes( tTypes, tSerializableModels, tSerializableViews )
	{
		if ( tTypes != null && tSerializableModels != null && tSerializableViews != null )
		{
			var tempTypesJSON = null;
			for ( let tempKey in tTypes )
			{
				if ( tempKey !== "default" )
				{
					let tempType = GraphVizWriter.WriteType( tempKey, tTypes[ tempKey ], tSerializableModels, tSerializableViews );
					if ( tempType != null )
					{
						if ( tempTypesJSON == null )
						{
							tempTypesJSON = [];
						}
						tempTypesJSON.push( tempType );
					}
				}
			}
			
			return tempTypesJSON;
		}
		
		return null;
	}
	
	static WriteType( tTypeName, tTypeModel, tSerializableModels, tSerializableViews )
	{
		if ( tTypeModel != null && tSerializableModels != null && tSerializableViews != null )
		{
			const tempJSON = {};
			{
				name: tTypeName
			};
			
			// Model class			
			if ( tTypeModel._modelClass !== tSerializableModels[ "default" ] )
			{
				for ( let tempKey in tSerializableModels )
				{
					if ( tSerializableModels[ tempKey ] === tTypeModel._modelClass )
					{
						tempJSON.modelClass = tempKey;
						break;
					}
				}
			}
			
			// View class
			if ( tTypeModel._viewClass !== tSerializableViews[ "default" ] )
			{
				for ( let tempKey in tSerializableViews )
				{
					if ( tSerializableViews[ tempKey ] === tTypeModel._viewClass )
					{
						tempJSON.viewClass = tempKey;
						break;
					}
				}
			}
			
			// Data			
			for ( let tempKey in tTypeModel.data )
			{
				tempJSON.data = tTypeModel.data;
				break;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteNode( tNodeModel, tNodeTypes, tEdgeTypes )
	{
		if ( tNodeModel != null )
		{
			var tempJSON =
			{
				id: tNodeModel._id,
			};
			
			// Type
			if ( tNodeTypes != null && tNodeModel._type !== tNodeTypes[ "default" ] )
			{
				for ( let tempKey in tNodeTypes )
				{
					if ( tNodeTypes[ tempKey ] === tNodeModel._type )
					{
						tempJSON.type = tempKey;
						break;
					}
				}
			}
			
			// Pins
			if ( tNodeModel._pins != null )
			{
				for ( let tempKey in tNodeModel._pins )
				{
					let tempPin = GraphVizWriter.WritePin( tNodeModel._pins[ tempKey ], tEdgeTypes );
					if ( tempPin != null )
					{
						if ( tempJSON.pins == null )
						{
							tempJSON.pins = {};
						}
						
						tempJSON.pins[ tempKey ] = tempPin;
					}
				}
				
				return tempJSON;
			}
			
			// Position
			const tempPosition = GraphVizWriter.WriteVector( tNodeModel._position );
			if ( tempPosition != null )
			{
				tempJSON.position = tempPosition;
			}
			
			// Data
			for ( let tempKey in tNodeModel.data )
			{
				tempJSON.data = tNodeModel.data;
				break;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WritePin( tPinModel, tEdgeTypes )
	{
		if ( tPinModel != null )
		{
			var tempJSON = null;
			
			// Links
			if ( tPinModel._isOut )
			{
				for ( let tempKey in tPinModel.links )
				{
					let tempEdge = GraphVizWriter.WriteEdge( tPinModel._links[ tempKey ], tEdgeTypes );
					if ( tempEdge != null )
					{
						if ( tempJSON == null )
						{
							tempJSON = { links: [] };
						}
						tempJSON.links.push( tempEdge );
					}
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteEdge( tEdgeModel, tEdgeTypes )
	{
		if ( tEdgeModel != null )
		{
			const tempTargetNode = tEdgeModel._target._node;
			var tempJSON =
			{
				node: tempTargetNode._id
			};
			
			// Pin
			const tempPins = tempTargetNode._pins;
			for ( let tempKey in tempPins )
			{
				if ( tempPins[ tempKey ] === tEdgeModel._target )
				{
					tempJSON.pin = tempKey;
					break;
				}
			}
			
			// Type
			if ( tEdgeTypes != null && tEdgeModel._type !== tEdgeTypes[ "default" ] )
			{
				for ( let tempKey in tEdgeTypes )
				{
					if ( tEdgeTypes[ tempKey ] === tEdgeModel._type )
					{
						tempJSON.type = tempKey;
						break;
					}
				}
			}
			
			// Data
			for ( let tempKey in tEdgeModel.data )
			{
				tempJSON.data = tEdgeModel.data;
				break;
			}
			
			return tempJSON;
		}
		
		return null;
	}
}