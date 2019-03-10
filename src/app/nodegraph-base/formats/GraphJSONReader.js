import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";

/**
*	Reader factory for the GraphJSON format
*	@memberof nodegraph-base
*/
export default class GraphJSONReader // TODO: Clustering
{
	/**
	*	Populates a graph model from GraphJSON data
	*	@param {Graph} tGraphModel Graph model to append data to
	*	@param {Object} tJSON Raw JSON representing a graph
	*	@param {string} [tNodeTextField=caption] Which field name should be considered as the visible text label of a node
	*	@param {string} [tEdgeTextField=caption] Which field name should be considered as the visible text label of an edge
	*/
	read( tGraphModel, tJSON, tNodeTextField = "caption", tEdgeTextField = "caption" )
	{
		if ( tGraphModel != null && tJSON != null && tJSON.nodes != null )
		{
			// Nodes
			const tempNodeRefs = {};
			var tempListLength = tJSON.nodes.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				let tempNodeJSON = tJSON.nodes[i];
				let tempNode = this.readNode( tGraphModel, tempNodeJSON, tNodeTextField );
				if ( tGraphModel.setNode( tempNode ) )
				{
					tempNodeRefs[ tempNodeJSON.id ] = tempNode;
				}
			}
			
			// Edges
			if ( tJSON.edges != null )
			{
				tempListLength = tJSON.edges.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					this.readEdge( tGraphModel, tJSON.edges[i], tempNodeRefs, tEdgeTextField );
				}
			}
		}
	}
	
	/**
	*	Reads JSON node data and adds it and its type into the graph model
	*	@param {Graph} tGraphModel Graph model to append data to
	*	@param {Object} tJSON Raw JSON representing a node
	*	@param {string} [tTextField=caption] Which field name should be considered as the visible text label of a node
	*	@return {Node} Node if successfully generated from the JSON
	*/
	readNode( tGraphModel, tJSON, tTextField = "caption" )
	{
		if ( tJSON != null )
		{
			// Node type
			var tempType = tJSON.type == null ? tGraphModel._nodeTypes[ "default" ] : tGraphModel._nodeTypes[ tJSON.type ];
			if ( tempType == null )
			{
				tempType = this.readNodeType( tJSON );
				if ( !tGraphModel.setNodeType( tempType ) )
				{
					return null;
				}
			}
			
			return this.createNode( tGraphModel, tempType );
		}
		
		return null;
	}
	
	/**
	*	Reads JSON node type data
	*	@param {Object} tJSON Raw JSON representing a node
	*	@param {string} tTextField Which field name should be considered as the visible text label of a node
	*	@return {TypeNode} Node type if successfully generated from the JSON
	*/
	readNodeType( tJSON )
	{
		return this.createNodeType( tJSON.type );
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
	*	Factory method for creating a new node
	*	@param {Graph} tGraphModel Model of the graph that the node is added to
	*	@param {TypeNode} tType Node type that the node belongs to
	*	@return {Node} Created node
	*/
	createNode( tGraphModel, tType )
	{
		return new tType._modelClass( tGraphModel, tType );
	}
	
	/**
	*	Reads JSON edge data and adds it and its type into the graph model
	*	@param {Graph} tGraphModel Graph model to append data to
	*	@param {Object} tJSON Raw JSON representing an edge
	*	@param {Object} tNodeRefs Associative array used to bind edges to nodes
	*	@param {string} [tTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {Edge} Edge if successfully generated from the JSON
	*/
	readEdge( tGraphModel, tJSON, tNodeRefs, tTextField = "caption" )
	{
		if ( tJSON != null && tJSON.source != null && tJSON.target != null )
		{
			// Source node
			const tempSourceNode = tNodeRefs[ tJSON.source ];
			if ( tempSourceNode != null )
			{
				// Target node
				const tempTargetNode = tNodeRefs[ tJSON.target ];
				if ( tempTargetNode != null )
				{
					// Edge type
					const tempTypeName = tJSON[ tTextField ];
					var tempType = tempTypeName == null ? tGraphModel._edgeTypes[ "default" ] : tGraphModel._edgeTypes[ tempTypeName ];
					if ( tempType == null )
					{
						tempType = this.readEdgeType( tJSON, tTextField );
						if ( !tGraphModel.setEdgeType( tempType ) )
						{
							return null;
						}
					}

					const tempSourcePin = tempSourceNode._pins.out;
					const tempEdge = this.createEdge( tempType, tempSourcePin, tempTargetNode._pins.in );
					tempSourcePin.setLink( tempEdge );
					
					return tempEdge;
				}
			}
		}
		
		return null;
	}
	
	/**
	*	Reads JSON edge type data
	*	@param {Object} tJSON Raw JSON representing an edge
	*	@param {string} [tTextField=caption] Which field name should be considered as the visible text label of an edge
	*	@return {TypeEdge} Edge type if successfully generated from the JSON
	*/
	readEdgeType( tJSON, tTextField = "caption" )
	{
		return this.createEdgeType( tJSON[ tTextField ] );
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
	*	Factory method for creating a new edge
	*	@param {TypeEdge} tType Edge type that the edge belongs to
	*	@param {Pin} tSourcePin Source pin of the edge
	*	@param {Pin} tTargetPin Target pin of the edge
	*	@return {Edge} Created edge
	*/
	createEdge( tType, tSourcePin, tTargetPin )
	{
		return new tType._modelClass( tType, tSourcePin, tTargetPin );
	}
}