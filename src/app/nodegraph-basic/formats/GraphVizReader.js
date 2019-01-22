import GraphVizReaderBase from "../../nodegraph/formats/GraphVizReader";
import Node from "../models/Node";
import NodeType from "../models/NodeType";
import EdgeType from "../models/EdgeType";
import EdgeView from "../views/graph/edge/Edge";
import NodeView from "../views/graph/node/Node";

export default class GraphVizReader extends GraphVizReaderBase
{
	readNodeType( tJSON, tDefaultType, tSerializableViews = { "default": NodeView, "Node": NodeView } )
	{
		const tempType = super.readNodeType( tJSON, tDefaultType, tSerializableViews );
		
		if ( tempType != null )
		{
			// Radius
			if ( tJSON.radius != null )
			{
				tempType.radius = tJSON.radius;
			}
			
			// Stroke
			if ( tJSON.stroke != null )
			{
				tempType.stroke = tJSON.stroke;
			}
			
			// Fill
			if ( tJSON.fill != null )
			{
				tempType.fill = tJSON.fill;
			}
		}
		
		return tempType;
	}
	
	createNodeType( tName, tViewClass )
	{
		return new NodeType( tName, tViewClass );
	}
	
	readEdgeType( tJSON, tDefaultType, tSerializableViews = { "default": EdgeView, "Edge": EdgeView } )
	{
		const tempType = super.readEdgeType( tJSON, tDefaultType, tSerializableViews );
		
		// Stroke
		if ( tempType != null && tJSON.stroke != null )
		{
			tempType.stroke = tJSON.stroke;
		}
		
		return tempType;
	}
	
	createEdgeType( tName, tViewClass )
	{
		return new EdgeType( tName, tViewClass );
	}
	
	readNode( tJSON, tTypes )
	{
		const tempNode = super.readNode( tJSON, tTypes );
		
		if ( tempNode != null )
		{
			// Text
			if ( tJSON.text != null )
			{
				tempNode.text = tJSON.radius;
			}
			
			// Data
			if ( tJSON.data != null )
			{
				tempNode.data = Object.assign( tempNode.data, tJSON.data ); // merge/overwrite!
			}
		}
		
		return tempNode;
	}
	
	createNode( tType )
	{
		return new Node( tType );
	}
}