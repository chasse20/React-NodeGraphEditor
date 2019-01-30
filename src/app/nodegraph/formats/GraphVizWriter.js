import NodeModel from "../models/Node";
import NodeView from "../views/graph/node/Node";
import EdgeModel from "../models/Edge";
import EdgeView from "../views/graph/edge/Edge";
import Vector2DModel from "../../core/Vector2D";

export default class GraphVizWriter
{
	write( tGraphModel )
	{
		if ( tGraphModel != null )
		{
			var tempJSON = null;
			
			// Position
			const tempPosition = this.writeVector( tGraphModel.position );
			if ( tempPosition != null )
			{
				tempJSON = { position: tempPosition };
			}
			
			// Zoom
			if ( tGraphModel.zoom !== 1 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.zoom = tGraphModel.zoom;
			}
			
			// Node types
			var tempArray = this.writeNodeTypes( tGraphModel._nodeTypes );
			if ( tempArray != null )
			{
				if ( tempJSON == null )
				{
					tempJSON = {};
				}
				tempJSON.nodeTypes = tempArray;
			}
			
			// Edge types
			tempArray = this.writeEdgeTypes( tGraphModel._edgeTypes );
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
				
				tempJSON.nodes.push( this.writeNode( tGraphModel._nodes[ tempKey ] ) );
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
			const tempJSON =
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
	
	static WriteNode( tNodeModel )
	{
		if ( tNodeModel != null )
		{
			var tempJSON =
			{
				id: tNodeModel._id,
				type: tNodeModel._type._name
			};

			// Pins
			if ( tNodeModel._pins != null )
			{
				for ( let tempKey in tNodeModel._pins )
				{
					let tempPin = GraphVizWriter.WritePin( tNodeModel._pins[ tempKey ] );
					if ( tempPin != null )
					{
						if ( tempJSON.pins == null )
						{
							tempJSON.pins = {};
						}
						
						tempJSON.pins[ tempKey ] = tempPin;
					}
				}
			}
			
			// Position
			const tempPosition = GraphVizWriter.WriteVector( tNodeModel.position );
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
	
	static WritePin( tPinModel )
	{
		if ( tPinModel != null )
		{
			var tempJSON = null;
			
			// Links
			if ( tPinModel._isOut )
			{
				for ( let tempKey in tPinModel._links )
				{
					let tempEdge = GraphVizWriter.WriteEdge( tPinModel._links[ tempKey ] );
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
	
	static WriteEdge( tEdgeModel )
	{
		if ( tEdgeModel != null )
		{
			const tempTargetNode = tEdgeModel._target._node;
			var tempJSON =
			{
				node: tempTargetNode._id,
				type: tEdgeModel._type._name
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