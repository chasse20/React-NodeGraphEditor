import GraphVizWriterBase from "../../nodegraph-base/formats/GraphVizWriter";
import EdgeView from "../views/graph/edges/Edge";
import NodeView from "../views/graph/nodes/Node";

export default class GraphVizWriter extends GraphVizWriterBase
{	
	writeNodeType( tTypeModel, tDefaultViewClass = NodeView )
	{
		const tempJSON = super.writeNodeType( tTypeModel, tDefaultViewClass );
		
		if ( tempJSON != null )
		{
			// Radius
			if ( tTypeModel.radius !== 50 )
			{
				tempJSON.radius = tTypeModel.radius;
			}
			
			// Stroke
			if ( tTypeModel.stroke !== "#808080" )
			{
				tempJSON.stroke = tTypeModel.stroke;
			}
			
			// Fill
			if ( tTypeModel.fill !== "#a9a9a9" )
			{
				tempJSON.fill = tTypeModel.fill;
			}
			
			return tempJSON;
		}

		return null;
	}
	
	writeEdgeType( tTypeModel, tDefaultViewClass = EdgeView )
	{
		const tempJSON = super.writeEdgeType( tTypeModel, tDefaultViewClass );
		
		if ( tempJSON != null )
		{
			// Stroke
			if ( tTypeModel.stroke !== "#808080" )
			{
				tempJSON.stroke = tTypeModel.stroke;
			}
			
			// Text
			if ( tTypeModel.text !== "" )
			{
				tempJSON.text = tTypeModel.text;
			}
			
			return tempJSON;
		}

		return null;
	}
	
	writeNode( tNodeModel )
	{
		const tempJSON = super.writeNode( tNodeModel );
		
		if ( tempJSON != null )
		{
			// Text
			if ( tNodeModel.text !== "" )
			{
				tempJSON.text = tNodeModel.text;
			}
			
			// Data
			for ( let tempKey in tNodeModel.data )
			{
				if ( tempJSON.data == null )
				{
					tempJSON.data = {};
				}
				
				tempJSON.data[ tempKey ] = tNodeModel.data[ tempKey ];
			}
			
			return tempJSON;
		}
		
		return null;
	}
}