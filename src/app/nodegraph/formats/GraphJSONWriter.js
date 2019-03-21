import GraphJSONWriterBase from "../../nodegraph-base/formats/GraphJSONWriter";

/**
*	Writer factory for the GraphJSON format
*	@memberof nodegraph
*	@augments nodegraph-base.GraphJSONWriter
*/
export default class GraphJSONWriter extends GraphJSONWriterBase
{
	/**
	*	Writes JSON from a node model (text and data associative array)
	*	@param {Node} tNodeModel Node model to write data from
	*	@param {string} [tNodeTextField=caption] Which field name should be considered as the visible text label of a node
	*	@param {string} [tEdgeTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {Object} JSON output
	*/
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
			if ( tempKey !== tNodeTextField )
			{
				tempJSON[ tempKey ] = tNodeModel.data[ tempKey ];
			}
		}
		
		return tempJSON;
	}
	
	/**
	*	Writes JSON from an edge model (weight and data associative array)
	*	@param {Edge} tEdgeModel Edge model to write data from
	*	@param {string} [tEdgeTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {Object} JSON output
	*/
	writeEdge( tEdgeModel, tEdgeTextField = "caption" )
	{
		const tempJSON = super.writeEdge( tEdgeModel, tEdgeTextField );
		
		// Weight
		if ( tEdgeModel.weight !== 1.0 )
		{
			tempJSON.weight = tEdgeModel.weight;
		}
		
		// Data
		for ( let tempKey in tEdgeModel.data )
		{
			if ( tempKey !== tEdgeTextField )
			{
				tempJSON[ tempKey ] = tEdgeModel.data[ tempKey ];
			}
		}
		
		return tempJSON;
	}
}