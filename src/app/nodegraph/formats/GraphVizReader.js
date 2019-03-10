import GraphVizReaderBase from "../../nodegraph-base/formats/GraphVizReader";
import Node from "../models/Node";
import Edge from "../models/Edge";
import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";
import EdgeView from "../views/graph/edges/Edge";
import NodeView from "../views/graph/nodes/Node";

/**
*	Reader factory for the GraphViz forma
*	@memberof nodegraph
*	@augments nodegraph-base.GraphVizReader
*/
export default class GraphVizReader extends GraphVizReaderBase
{
	/**
	*	Reads JSON node type data (radius and fill)
	*	@param {Object} tJSON Raw JSON representing a node
	*	@param {Object} [tSerializableModels] Associative array of serializable models with key as model name and value as class
	*	@param {Object} [tSerializableViews] Associative array of serializable views with key as model name and value as class
	*	@return {TypeNode} Node type if successfully generated from the JSON
	*/
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
			
			// Fill
			if ( tJSON.fill != null )
			{
				tempType.fill = tJSON.fill;
			}
		}
		
		return tempType;
	}
	
	/**
	*	Factory method for creating a new node type
	*	@param {string} tName Name of the type
	*	@param {Object} tModelClass Model class of the type
	*	@param {Object} tViewClass View class of the type
	*	@return {TypeNode} Created node type
	*/
	createNodeType( tName, tModelClass, tViewClass )
	{
		return new TypeNode( tName, tModelClass, tViewClass );
	}
	
	/**
	*	Reads JSON edge type data (stroke and text)
	*	@param {Object} tJSON Raw JSON representing an edge
	*	@param {Object} [tSerializableModels] Associative array of serializable models with key as model name and value as class
	*	@param {Object} [tSerializableViews] Associative array of serializable views with key as model name and value as class
	*	@return {TypeEdge} Edge type if successfully generated from the JSON
	*/
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
	
	/**
	*	Factory method for creating a new edge type
	*	@param {string} tName Name of the type
	*	@param {Object} tModelClass Model class of the type
	*	@param {Object} tViewClass View class of the type
	*	@return {TypeEdge} Created edge type
	*/
	createEdgeType( tName, tModelClass, tViewClass )
	{
		return new TypeEdge( tName, tModelClass, tViewClass );
	}
	
	/**
	*	Reads JSON node data (text and data associative array) and adds it and its type into the graph model
	*	@param {Graph} tGraphModel Graph model to append data to
	*	@param {Object} tJSON Raw JSON representing a node
	*	@return {Node} Node if successfully generated from the JSON
	*/
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