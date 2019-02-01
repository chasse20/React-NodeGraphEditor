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
				let tempNode = this.writeNode( tGraphModel._nodes[ tempKey ] );
				if ( tempNode != null )
				{
					if ( tempJSON == null )
					{
						tempJSON = {};
					}
					
					if ( tempJSON.nodes == null )
					{
						tempJSON.nodes = [];
					}
					
					tempJSON.nodes.push( tempNode );
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	writeVector( tVectorModel )
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
	
	writeNodeTypes( tTypes )
	{
		if ( tTypes != null )
		{
			var tempTypesJSON = null;
			for ( let tempKey in tTypes )
			{
				let tempType = this.writeNodeType( tTypes[ tempKey ] );
				if ( tempType != null )
				{
					if ( tempTypesJSON == null )
					{
						tempTypesJSON = [];
					}
					tempTypesJSON.push( tempType );
				}
			}
			
			return tempTypesJSON;
		}
		
		return null;
	}
	
	writeNodeType( tTypeModel )
	{
		if ( tTypeModel != null && tTypeModel._name !== "default" )
		{
			const tempJSON =
			{
				name: tTypeModel._name
			};
			
			// View class
			if ( tTypeModel._viewClass != null )
			{
				tempJSON.viewClass = tTypeModel._viewClass.constructor.name;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	writeEdgeTypes( tTypes )
	{
		return this.writeNodeTypes( tTypes );
	}
	
	writeNode( tNodeModel )
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
					let tempPin = this.writePin( tNodeModel._pins[ tempKey ] );
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
			const tempPosition = this.writeVector( tNodeModel.position );
			if ( tempPosition != null )
			{
				tempJSON.position = tempPosition;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	writePin( tPinModel )
	{
		if ( tPinModel != null )
		{
			var tempJSON = null;
			
			// Links
			if ( tPinModel._isOut )
			{
				for ( let tempKey in tPinModel._links )
				{
					let tempEdge = this.writeEdge( tPinModel._links[ tempKey ] );
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
	
	writeEdge( tEdgeModel )
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
			
			return tempJSON;
		}
		
		return null;
	}
}