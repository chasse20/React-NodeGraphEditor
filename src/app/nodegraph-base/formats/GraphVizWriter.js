import Node from "../models/Node";
import Edge from "../models/Edge";
import NodeView from "../views/graph/nodes/Node";
import EdgeView from "../views/graph/edges/Edge";

/**
*	Writer factory for the GraphViz format
*	@memberof nodegraph-base
*/
export default class GraphVizWriter
{
	/**
	*	Writes GraphViz JSON from a graph model
	*	@param {Graph} tGraphModel Graph model to write data from
	*	@return {Object} GraphViz JSON output
	*/
	write( tGraphModel )
	{
		if ( tGraphModel != null )
		{
			var tempJSON = null;
			
			// Position
			const tempPosition = this.writeVector( tGraphModel.position );
			if ( tempPosition != null )
			{
				tempJSON = { position: tempPosition };
			}
			
			// Zoom
			if ( tGraphModel.zoom !== 1 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.zoom = tGraphModel.zoom;
			}
			
			// Node types
			var tempArray = this.writeNodeTypes( tGraphModel._nodeTypes );
			if ( tempArray != null )
			{
				if ( tempJSON == null )
				{
					tempJSON = {};
				}
				tempJSON.nodeTypes = tempArray;
			}
			
			// Edge types
			tempArray = this.writeEdgeTypes( tGraphModel._edgeTypes );
			if ( tempArray != null )
			{
				if ( tempJSON == null )
				{
					tempJSON = {};
				}
				tempJSON.edgeTypes = tempArray;
			}
			
			// Nodes
			for ( let tempKey in tGraphModel._nodes )
			{
				let tempNode = this.writeNode( tGraphModel._nodes[ tempKey ] );
				if ( tempNode != null )
				{
					if ( tempJSON == null )
					{
						tempJSON = {};
					}
					
					if ( tempJSON.nodes == null )
					{
						tempJSON.nodes = [];
					}
					
					tempJSON.nodes.push( tempNode );
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	/**
	*	Writes JSON from a vector model
	*	@param {core.Vector2D} tVectorModel Vector model to write data from
	*	@return {Object} JSON output
	*/
	writeVector( tVectorModel )
	{
		if ( tVectorModel != null )
		{
			var tempJSON = null;
			
			// X
			if ( tVectorModel.x !== 0 )
			{
				tempJSON = { x: tVectorModel.x };
			}
			
			// Y
			if ( tVectorModel.y !== 0 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.y = tVectorModel.y;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	/**
	*	Writes JSON array of node types from an associative array of models
	*	@param {Object} tTypes Associative array of node types with key as name and value as type model
	*	@return {Object[]} JSON output
	*/
	writeNodeTypes( tTypes )
	{
		if ( tTypes != null )
		{
			var tempTypesJSON = null;
			for ( let tempKey in tTypes )
			{
				let tempType = this.writeNodeType( tTypes[ tempKey ] );
				if ( tempType != null )
				{
					if ( tempTypesJSON == null )
					{
						tempTypesJSON = [];
					}
					tempTypesJSON.push( tempType );
				}
			}
			
			return tempTypesJSON;
		}
		
		return null;
	}
	
	/**
	*	Writes JSON of a node type
	*	@param {TypeNode} tTypeModel Type model
	*	@param {Object} [tDefaultModelClass] Default model class used to determine if the output should bother including it
	*	@param {Object} [tDefaultViewClass] Default view class used to determine if the output should bother including it
	*	@return {Object} JSON output
	*/
	writeNodeType( tTypeModel, tDefaultModelClass = Node, tDefaultViewClass = NodeView )
	{
		if ( tTypeModel != null && tTypeModel._name !== "default" )
		{
			const tempJSON =
			{
				name: tTypeModel._name
			};
			
			// Model class
			if ( tTypeModel._modelClass != null && tTypeModel._modelClass !== tDefaultModelClass )
			{
				tempJSON.modelClass = tTypeModel._modelClass.name;
			}
			
			// View class
			if ( tTypeModel._viewClass != null && tTypeModel._viewClass !== tDefaultViewClass )
			{
				tempJSON.viewClass = tTypeModel._viewClass.name;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	/**
	*	Writes JSON array of edge types from an associative array of models
	*	@param {Object} tTypes Associative array of node types with key as name and value as type model
	*	@return {Object[]} JSON output
	*/
	writeEdgeTypes( tTypes )
	{
		if ( tTypes != null )
		{
			var tempTypesJSON = null;
			for ( let tempKey in tTypes )
			{
				let tempType = this.writeEdgeType( tTypes[ tempKey ] );
				if ( tempType != null )
				{
					if ( tempTypesJSON == null )
					{
						tempTypesJSON = [];
					}
					tempTypesJSON.push( tempType );
				}
			}
			
			return tempTypesJSON;
		}
		
		return null;
	}
	
	/**
	*	Writes JSON of an edge type
	*	@param {TypeEdge} tTypeModel Type model
	*	@param {Object} [tDefaultModelClass] Default model class used to determine if the output should bother including it
	*	@param {Object} [tDefaultViewClass] Default view class used to determine if the output should bother including it
	*	@return {Object} JSON output
	*/
	writeEdgeType( tTypeModel, tDefaultModelClass = Edge, tDefaultViewClass = EdgeView )
	{
		return this.writeNodeType( tTypeModel, tDefaultViewClass );
	}
	
	/**
	*	Writes JSON from a node model
	*	@param {Node} tNodeModel Node model to write data from
	*	@return {Object} JSON output
	*/
	writeNode( tNodeModel )
	{
		if ( tNodeModel != null )
		{
			var tempJSON =
			{
				id: tNodeModel._id,
				type: tNodeModel._type._name
			};

			// Pins
			if ( tNodeModel._pins != null )
			{
				for ( let tempKey in tNodeModel._pins )
				{
					let tempPin = this.writePin( tNodeModel._pins[ tempKey ] );
					if ( tempPin != null )
					{
						if ( tempJSON.pins == null )
						{
							tempJSON.pins = {};
						}
						
						tempJSON.pins[ tempKey ] = tempPin;
					}
				}
			}
			
			// Position
			const tempPosition = this.writeVector( tNodeModel.position );
			if ( tempPosition != null )
			{
				tempJSON.position = tempPosition;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	/**
	*	Writes JSON from a pin model
	*	@param {Pin} tPinModel Pin model to write data from
	*	@return {Object} JSON output
	*/
	writePin( tPinModel )
	{
		if ( tPinModel != null )
		{
			var tempJSON = null;
			
			// Links
			if ( tPinModel._isOut )
			{
				for ( let tempKey in tPinModel._links )
				{
					let tempEdge = this.writeEdge( tPinModel._links[ tempKey ] );
					if ( tempEdge != null )
					{
						if ( tempJSON == null )
						{
							tempJSON = { links: [] };
						}
						tempJSON.links.push( tempEdge );
					}
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	/**
	*	Writes JSON from an edge model
	*	@param {Edge} tEdgeModel Edge model to write data from
	*	@return {Object} JSON output
	*/
	writeEdge( tEdgeModel )
	{
		if ( tEdgeModel != null )
		{
			const tempTargetNode = tEdgeModel._target._node;
			var tempJSON =
			{
				node: tempTargetNode._id,
				type: tEdgeModel._type._name
			};
			
			// Pin
			const tempPins = tempTargetNode._pins;
			for ( let tempKey in tempPins )
			{
				if ( tempPins[ tempKey ] === tEdgeModel._target )
				{
					tempJSON.pin = tempKey;
					break;
				}
			}
			
			return tempJSON;
		}
		
		return null;
	}
}