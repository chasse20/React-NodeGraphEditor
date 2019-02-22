import GraphJSONWriterBase from "../../nodegraph-base/formats/GraphJSONWriter";

export default class GraphJSONWriter extends GraphJSONWriterBase
{	
	writeNode( tNodeModel, tEdges, tNodeTextField = "caption", tEdgeTextField = "caption" )
	{
		const tempJSON = super.writeNode( tNodeModel, tEdges, tNodeTextField, tEdgeTextField );
		
		// Text
		if ( tNodeModel.text !== "" )
		{
			tempJSON[ tNodeTextField ] = tNodeModel.text;
		}
		
		// Data
		for ( let tempKey in tNodeModel.data )
		{
			tempJSON[ tempKey ] = tNodeModel.data[ tempKey ];
		}
		
		return tempJSON;
	}
}