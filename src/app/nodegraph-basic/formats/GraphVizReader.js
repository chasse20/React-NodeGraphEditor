import GraphVizReaderBase from "../../nodegraph/formats/GraphVizReader";
import Node from "../models/Node";
import Edge from "../../nodegraph/models/Edge";
import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";
import EdgeView from "../views/graph/Edge";
import NodeView from "../views/graph/Node";

export default class GraphVizReader extends GraphVizReaderBase
{
	readNodeType( tJSON, tSerializableModels = { "Node": Node }, tSerializableViews = { "Node": NodeView } )
	{
		const tempType = super.readNodeType( tJSON, tSerializableModels, tSerializableViews );
		
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
	
	createNodeType( tName, tModelClass, tViewClass )
	{
		return new TypeNode( tName, tModelClass, tViewClass );
	}
	
	readEdgeType( tJSON, tSerializableModels = { "Edge": Edge }, tSerializableViews = { "Edge": EdgeView } )
	{
		const tempType = super.readEdgeType( tJSON, tSerializableModels, tSerializableViews );
		
		if ( tempType != null )
		{
			// Stroke
			if ( tJSON.stroke != null )
			{
				tempType.stroke = tJSON.stroke;
			}
			
			// Text
			if ( tJSON.text != null )
			{
				tempType.text = tJSON.text;
			}
		}
		
		return tempType;
	}
	
	createEdgeType( tName, tModelClass, tViewClass )
	{
		return new TypeEdge( tName, tModelClass, tViewClass );
	}
	
	readNode( tGraphModel, tJSON )
	{
		const tempNode = super.readNode( tGraphModel, tJSON );
		
		if ( tempNode != null )
		{
			// Text
			if ( tJSON.text != null )
			{
				tempNode.text = tJSON.text;
			}
			
			// Data
			if ( tJSON.data != null )
			{
				tempNode.data = Object.assign( tempNode.data, tJSON.data ); // merge/overwrite!
			}
		}
		
		return tempNode;
	}
}