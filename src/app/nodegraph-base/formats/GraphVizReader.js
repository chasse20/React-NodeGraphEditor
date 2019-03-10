import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";
import Edge from "../models/Edge";
import Node from "../models/Node";
import EdgeView from "../views/graph/edges/Edge";
import NodeView from "../views/graph/nodes/Node";

/**
*	Reader factory for the GraphViz format
*	@memberof nodegraph-base
*/
export default class GraphVizReader
{
	/**
	*	Populates a graph model from GraphViz JSON data
	*	@param {Graph} tGraphModel Graph model to append data to
	*	@param {Object} tJSON Raw JSON representing a graph
	*/
	read( tGraphModel, tJSON )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Position
			this.readVector( tGraphModel.position, tJSON.position );
			
			// Zoom
			if ( tJSON.zoom != null )
			{
				tGraphModel.zoom = tJSON.zoom;
			}
			
			// Node Types
			if ( tJSON.nodeTypes != null )
			{
				const tempListLength = tJSON.nodeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					tGraphModel.setNodeType( this.readNodeType( tJSON.nodeTypes[i] ) );
				}
			}
			
			// Edge Types
			if ( tJSON.edgeTypes != null )
			{
				const tempListLength = tJSON.edgeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					tGraphModel.setEdgeType( this.readEdgeType( tJSON.edgeTypes[i] ) );
				}
			}
			
			// Nodes
			if ( tJSON.nodes != null )
			{
				// Pre
				const tempNodeJSONs = {};
				const tempNodeRefs = {};
				const tempListLength = tJSON.nodes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					let tempNodeJSON = tJSON.nodes[i];
					let tempNode = this.readNode( tGraphModel, tempNodeJSON );
					if ( tGraphModel.setNode( tempNode ) )
					{
						tempNodeJSONs[ tempNode._id ] = tempNodeJSON;
						tempNodeRefs[ tempNodeJSON.id ] = tempNode;
					}
				}
				
				// Post with references
				for ( let tempID in tempNodeRefs )
				{
					this.readNodePost( tGraphModel, tempNodeRefs[ tempID ], tempNodeJSONs[ tempNodeRefs[ tempID ]._id ], tempNodeRefs );
				}
			}
		}
	}
	
	/**
	*	Populates a vector model from JSON
	*	@param {core.Vector2D} tVectorModel Vector model to append data to
	*	@param {Object} tJSON Raw JSON representing a vector
	*/
	readVector( tVectorModel, tJSON )
	{
		if ( tJSON != null )
		{
			// X
			if ( tJSON.x != null )
			{
				tVectorModel.x = tJSON.x;
			}
			
			// Y
			if ( tJSON.y != null )
			{
				tVectorModel.y = tJSON.y;
			}
		}
	}
	
	/**
	*	Reads JSON node type data
	*	@param {Object} tJSON Raw JSON representing a node
	*	@param {Object} [tSerializableModels] Associative array of serializable models with key as model name and value as class
	*	@param {Object} [tSerializableViews] Associative array of serializable views with key as model name and value as class
	*	@return {TypeNode} Node type if successfully generated from the JSON
	*/
	readNodeType( tJSON, tSerializableModels = { "Node": Node }, tSerializableViews = { "Node": NodeView } )
	{
		if ( tJSON != null && tJSON.name != null )
		{
			// Classes
			const tempModelClass = tJSON.modelClass == null ? undefined : tSerializableModels[ tJSON.modelClass ];
			const tempViewClass = tJSON.viewClass == null ? undefined : tSerializableViews[ tJSON.viewClass ];
			
			return this.createNodeType( tJSON.name, tempModelClass, tempViewClass );
		}
		
		return null;
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
	*	Reads JSON edge type data
	*	@param {Object} tJSON Raw JSON representing an edge
	*	@param {Object} [tSerializableModels] Associative array of serializable models with key as model name and value as class
	*	@param {Object} [tSerializableViews] Associative array of serializable views with key as model name and value as class
	*	@return {TypeEdge} Edge type if successfully generated from the JSON
	*/
	readEdgeType( tJSON, tSerializableModels = { "Edge": Edge }, tSerializableViews = { "Edge": EdgeView } )
	{
		if ( tJSON != null && tJSON.name != null )
		{
			// Classes
			const tempModelClass = tJSON.modelClass == null ? undefined : tSerializableModels[ tJSON.modelClass ];
			const tempViewClass = tJSON.viewClass == null ? undefined : tSerializableViews[ tJSON.viewClass ];
			
			return this.createEdgeType( tJSON.name, tempModelClass, tempViewClass );
		}
		
		return null;
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
	*	Reads JSON node data and adds it and its type into the graph model
	*	@param {Graph} tGraphModel Graph model to append data to
	*	@param {Object} tJSON Raw JSON representing a node
	*	@return {Node} Node if successfully generated from the JSON
	*/
	readNode( tGraphModel, tJSON )
	{
		if ( tJSON != null )
		{
			// Node type
			var tempType = tJSON.type == null ? tGraphModel._nodeTypes[ "default" ] : tGraphModel._nodeTypes[ tJSON.type ];
			if ( tempType == null )
			{
				tempType = this.createNodeType();
				if ( !tGraphModel.setNodeType( tempType ) )
				{
					return null;
				}
			}
			
			const tempNode = this.createNode( tGraphModel, tempType );
			
			// Position
			this.readVector( tempNode.position, tJSON.position );
			
			return tempNode;
		}
		
		return null;
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
	*	Post-read of node data to establish edge links
	*	@param {Graph} tGraphModel Graph model used as reference for edge types
	*	@param {Node} tNodeModel Node model to create edge links from
	*	@param {Object} tJSON Raw JSON representing a node
	*	@param {Object} tNodeRefs Associative array used to bind edges to nodes
	*/
	readNodePost( tGraphModel, tNodeModel, tJSON, tNodeRefs )
	{
		if ( tJSON.pins != null )
		{
			// Pins
			for ( let tempName in tJSON.pins )
			{
				let tempPin = tNodeModel._pins[ tempName ];
				if ( tempPin != null )
				{
					this.readPinPost( tGraphModel, tempPin, tJSON.pins[ tempName ], tNodeRefs );
				}
			}
		}
	}
	
	/**
	*	Reads a pin model to establish edge links
	*	@param {Graph} tGraphModel Graph model used as reference for edge types
	*	@param {Pin} tPinModel Pin model to create edge links from
	*	@param {Object} tJSON Raw JSON representing a pin
	*	@param {Object} tNodeRefs Associative array used to bind edges to nodes
	*/
	readPinPost( tGraphModel, tPinModel, tJSON, tNodeRefs )
	{
		if ( tPinModel._isOut && tJSON != null && tJSON.links != null )
		{
			for ( let i = ( tJSON.links.length - 1 ); i >= 0; --i )
			{
				tPinModel.setLink( this.readEdge( tGraphModel, tJSON.links[i], tPinModel, tNodeRefs ) );
			}
		}
	}
	
	/**
	*	Reads JSON edge data and adds it and its type into the graph model
	*	@param {Graph} tGraphModel Graph model used as reference for edge types
	*	@param {Object} tJSON Raw JSON representing an edge
	*	@param {Pin} tSourcePin Source pin of the edge
	*	@param {Object} tNodeRefs Associative array used to bind edges to nodes
	*	@return {Edge} Edge if successfully generated from the JSON
	*/
	readEdge( tGraphModel, tJSON, tSourcePin, tNodeRefs )
	{
		if ( tJSON != null && tJSON.node != null && tJSON.pin != null && tSourcePin != null && tNodeRefs != null )
		{
			// Target node and pin
			const tempTargetNode = tNodeRefs[ tJSON.node ];
			if ( tempTargetNode != null )
			{
				const tempTargetPin = tempTargetNode._pins[ tJSON.pin ];
				if ( tempTargetPin != null )
				{
					// Edge type
					var tempType = tJSON.type == null ? tGraphModel._edgeTypes[ "default" ] : tGraphModel._edgeTypes[ tJSON.type ];
					if ( tempType == null )
					{
						tempType = this.createEdgeType();
						if ( !tGraphModel.setEdgeType( tempType ) )
						{
							return null;
						}
					}

					return this.createEdge( tempType, tSourcePin, tempTargetPin );
				}
			}
		}
		
		return null;
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