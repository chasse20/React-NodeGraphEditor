import GraphJSONReaderBase from "../../nodegraph-base/formats/GraphJSONReader";
import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";

/**
*	Reader factory for the GraphJSON format
*	@memberof nodegraph
*	@augments nodegraph-base.GraphJSONReader
*/
export default class GraphJSONReader extends GraphJSONReaderBase
{
	/**
	*	Reads JSON node data (text and data associative array) and adds it and its type into the graph model
	*	@param {Graph} tGraphModel Graph model to append data to
	*	@param {Object} tJSON Raw JSON representing a node
	*	@param {string} [tTextField=caption] Which field name should be considered as the visible text label of a node
	*	@return {Node} Node if successfully generated from the JSON
	*/
	readNode( tGraphModel, tJSON, tTextField = "caption" )
	{
		const tempNode = super.readNode( tGraphModel, tJSON, tTextField );
		
		// Data
		if ( tempNode != null )
		{
			delete tJSON.type;
			var tempData = null;
			
			const tempText = tJSON[ tTextField ];
			if ( tempText != null )
			{
				tempNode.text = tempText;				
				delete tJSON[ tTextField ];
			}
			
			for ( let tempField in tJSON )
			{
				if ( tempField !== "id" ) // still need this for post linking
				{
					if ( tempData === null )
					{
						tempData = {};
					}
					tempData[ tempField ] = tJSON[ tempField ];
				}
			}
			
			if ( tempData !== null )
			{
				tempNode.data = Object.assign( tempNode.data, tempData ); // merge/overwrite!
			}
		}
		
		return tempNode;
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
	*	Reads JSON edge type data (text)
	*	@param {Object} tJSON Raw JSON representing an edge
	*	@param {string} [tTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {TypeEdge} Edge type if successfully generated from the JSON
	*/
	readEdgeType( tJSON, tTextField = "caption" )
	{
		const tempType = super.readEdgeType( tJSON, tTextField );
		
		if ( tempType != null )
		{
			// Text
			const tempText = tJSON[ tTextField ];
			if ( tempText != null )
			{
				tempType.text = tempText;
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
}