import GraphVizWriterBase from "../../nodegraph-base/formats/GraphVizWriter";
import Node from "../models/Node";
import Edge from "../models/Edge";
import EdgeView from "../views/graph/edges/Edge";
import NodeView from "../views/graph/nodes/Node";

/**
*	Writer factory for the GraphViz format
*	@memberof nodegraph
*	@augments nodegraph-base.GraphVizWriter
*/
export default class GraphVizWriter extends GraphVizWriterBase
{
	/**
	*	Writes JSON of a node type (radius and fill)
	*	@param {TypeNode} tTypeModel Type model
	*	@param {Object} [tDefaultModelClass] Default model class used to determine if the output should bother including it
	*	@param {Object} [tDefaultViewClass] Default view class used to determine if the output should bother including it
	*	@return {Object} JSON output
	*/
	writeNodeType( tTypeModel, tDefaultModelClass = Node, tDefaultViewClass = NodeView )
	{
		const tempJSON = super.writeNodeType( tTypeModel, tDefaultViewClass );
		
		if ( tempJSON != null )
		{
			// Radius
			if ( tTypeModel.radius !== 50 )
			{
				tempJSON.radius = tTypeModel.radius;
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
	
	/**
	*	Writes JSON of an edge type (stroke and text)
	*	@param {TypeEdge} tTypeModel Type model
	*	@param {Object} [tDefaultModelClass] Default model class used to determine if the output should bother including it
	*	@param {Object} [tDefaultViewClass] Default view class used to determine if the output should bother including it
	*	@return {Object} JSON output
	*/
	writeEdgeType( tTypeModel, tDefaultModelClass = Edge, tDefaultViewClass = EdgeView )
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
	
	/**
	*	Writes JSON from a node model (text and data associative array)
	*	@param {Node} tNodeModel Node model to write data from
	*	@return {Object} JSON output
	*/
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
	
	/**
	*	Writes JSON from an edge model (weight and data associative array)
	*	@param {Edge} tEdgeModel Edge model to write data from
	*	@return {Object} JSON output
	*/
	writeEdge( tEdgeModel )
	{
		const tempJSON = super.writeEdge( tEdgeModel );
		
		if ( tempJSON != null )
		{
			// Weight
			if ( tEdgeModel.weight !== 1.0 )
			{
				tempJSON.weight = tEdgeModel.weight;
			}
			
			// Data
			for ( let tempKey in tEdgeModel.data )
			{
				if ( tempJSON.data == null )
				{
					tempJSON.data = {};
				}
				
				tempJSON.data[ tempKey ] = tEdgeModel.data[ tempKey ];
			}
			
			return tempJSON;
		}
		
		return null;
	}
}