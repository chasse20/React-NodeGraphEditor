import { action, decorate, observable, set, remove, get, has, values } from "mobx";
import Vector2D from "../../core/Vector2D";

/**
*	Graph model responsible for tracking nodes, selections, and interactive states
*	@memberof nodegraph-base
*/
export default class Graph
{
	constructor()
	{
		/**
		*	Associative array of node models
		*	@type {Object}
		*/
		this._nodes = {};
		/**
		*	Counter for the number of nodes in the graph
		*	@type {number}
		*/
		this._nodesCount = 0;
		/**
		*	Associative array of selected nodes
		*	@type {Object}
		*/
		this._selectedNodes = {};
		/**
		*	Counter for the number of selected nodes in the graph
		*	@type {number}
		*/
		this._selectedNodesCount = 0;
		/**
		*	Associative array of selected edges
		*	@type {Object}
		*/
		this._selectedEdges = {};
		/**
		*	Counter for the number of selected edges in the graph
		*	@type {number}
		*/
		this._selectedEdgesCount = 0;
		/**
		*	Associative array of node type models
		*	@type {Object}
		*/
		this._nodeTypes = {};
		/**
		*	Associative array of edge type models
		*	@type {Object}
		*/
		this._edgeTypes = {};
		/**
		*	Current world position of the graph used for panning
		*	@type {core.Vector2D}
		*/
		this.position = new Vector2D();
		/**
		*	Current zoom level
		*	@type {number}
		*/
		this.zoom = 1;
		/**
		*	Zoom speed for interactions such as the mouse wheel
		*	@type {number}
		*/
		this.zoomSpeed = 0.05;
		/**
		*	Minimum allowed zoom amount
		*	@type {number}
		*/
		this.minZoom = 0.1;
		/**
		*	Maximum allowed zoom amount
		*	@type {number}
		*/
		this.maxZoom = 1;
		/**
		*	If the graph is currently in a panning state
		*	@type {bool}
		*/
		this.isPanning = false;
		/**
		*	If the graph is currently in a marquee selection state
		*	@type {bool}
		*/
		this.isMarqueeing = false;
		/**
		*	If the graph is currently set in pan mode
		*	@type {bool}
		*/
		this.isPanMode = false;
		/**
		*	Size of the graph's grid
		*	@type {number}
		*/
		this.gridSize = 100;
		/**
		*	Grid snap increment used when dragging nodes
		*	@type {number}
		*/
		this.gridSnapIncrement = 5;
		/**
		*	If the grid should be displayed
		*	@type {bool}
		*/
		this.isGridVisible = true;
		/**
		*	If the node selections should be snapped to the grid
		*	@type {bool}
		*/
		this.isGridSnap = false;
	}
	
	/**
	*	Adds a node to the graph
	*	@param {Node} tNode Node to add
	*	@return {bool} True if added
	*/
	setNode( tNode )
	{
		if ( tNode != null && !has( this._nodes, tNode._id ) )
		{
			set( this._nodes, tNode._id, tNode );
			
			return true;
		}
		
		return false;
	}
	
	/**
	*	Removes a node from the graph, removes it from selection, and cleans up its links
	*	@param {Node} tNode Node to remove
	*	@return {bool} True if removed
	*/
	removeNode( tNode )
	{
		if ( tNode != null && tNode === get( this._nodes, tNode._id ) )
		{
			tNode.clearLinks();
			this.removeSelectedNode( tNode );
			remove( this._nodes, tNode._id );

			return true;
		}
		
		return false;
	}
	
	/**
	*	Marks node as selected
	*	@param {Node} tNode Node to mark as selected
	*	@return {bool} True if set
	*/
	setSelectedNode( tNode )
	{
		if ( this._selectedNodes[ tNode._id ] === undefined )
		{
			this._selectedNodes[ tNode._id ] = tNode;
			++this._selectedNodesCount;
			
			tNode._isSelected = true;
			
			return true;
		}
		
		return false;
	}
	
	/**
	*	Deselects a node
	*	@param {Node} tNode Node to unmark as selected
	*	@return {bool} True if unset
	*/
	removeSelectedNode( tNode )
	{
		if ( this._selectedNodes[ tNode._id ] !== undefined )
		{
			delete this._selectedNodes[ tNode._id ];
			--this._selectedNodesCount;
			
			tNode._isSelected = false;

			return true;
		}
		
		return false;
	}
	
	/**
	*	Clears all selected nodes
	*/
	clearSelectedNodes()
	{
		const tempNodes = Object.values( this._selectedNodes );
		for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
		{
			this.removeSelectedNode( tempNodes[i] );
		}
	}
	
	/**
	*	Marks edge as selected
	*	@param {Edge} tEdge Edge to mark as selected
	*	@return {bool} True if set
	*/
	setSelectedEdge( tEdge )
	{
		if ( tEdge != null )
		{
			const tempID = tEdge.id;
			if ( !has( this._selectedEdges, tempID ) )
			{
				set( this._selectedEdges, tempID, tEdge );
				++this._selectedEdgesCount;
				
				tEdge._isSelected = true;
				
				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Deselects an edge
	*	@param {Edge} tEdge Edge to unmark as selected
	*	@return {bool} True if unset
	*/
	removeSelectedEdge( tEdge )
	{
		if ( tEdge != null )
		{
			const tempID = tEdge.id;
			if ( tEdge === get( this._selectedEdges, tempID ) )
			{			
				remove( this._selectedEdges, tempID );
				--this._selectedEdgesCount;
				
				tEdge._isSelected = false;

				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Clears all selected edges
	*/
	clearSelectedEdges()
	{
		const tempEdges = values( this._selectedEdges );
		for ( let i = ( tempEdges.length - 1 ); i >= 0; --i )
		{
			this.removeSelectedEdge( tempEdges[i] );
		}
	}
	
	/**
	*	Adds a node type to the graph
	*	@param {TypeNode} tType Node type to add
	*	@return {bool} True if added
	*/
	setNodeType( tType )
	{
		if ( tType != null && !has( this._nodeTypes, tType._name ) )
		{
			set( this._nodeTypes, tType._name, tType );
			
			return true;
		}
		
		return false;
	}
	
	/**
	*	Removes a node type from the graph as well as all nodes belonging to it
	*	@param {TypeNode} tType Node type to remove
	*	@return {bool} True if removed
	*/
	removeNodeType( tType )
	{
		if ( tType != null && tType === get( this._nodeTypes, tType._name ) )
		{
			// Remove nodes that belong to the type
			const tempNodes = values( this._nodes );
			for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
			{
				if ( tempNodes[i]._type === tType )
				{
					this.removeNode( tempNodes[i] );
				}
			}

			remove( this._nodeTypes, tType._name );
			
			return true;
		}
		
		return false;
	}
	
	/**
	*	Adds an edge type to the graph
	*	@param {TypeEdge} tType Edge type to add
	*	@return {bool} True if added
	*/
	setEdgeType( tType )
	{
		if ( tType != null && !has( this._edgeTypes, tType._name ) )
		{
			set( this._edgeTypes, tType._name, tType );
			
			return true;
		}
		
		return false;
	}
	
	/**
	*	Removes an edge type from the graph as well as all edges belonging to it
	*	@param {TypeEdge} tType Edge type to remove
	*	@return {bool} True if removed
	*/
	removeEdgeType( tType )
	{
		if ( tType != null && tType === get( this._edgeTypes, tType._name ) )
		{
			// Remove edges that belong to the type
			const tempNodes = values( this._nodes );
			for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
			{
				tempNodes[i].removeEdgesOfType( tType );
			}
			
			remove( this._edgeTypes, tType._name );

			return true;
		}
		
		return false;
	}
}

decorate( Graph,
	{
		_nodes: observable.shallow,
		_selectedNodesCount: observable,
		_selectedEdges: observable.shallow,
		_selectedEdgesCount: observable,
		_nodeTypes: observable.shallow,
		_edgeTypes: observable.shallow,
		position: observable,
		zoom: observable,
		isPanning: observable,
		isMarqueeing: observable,
		isPanMode: observable,
		gridSize: observable,
		isGridVisible: observable,
		isGridSnap: observable,
		setNode: action,
		removeNode: action,
		setSelectedEdge: action,
		removeSelectedEdge: action,
		clearSelectedEdges: action,
		setNodeType: action,
		removeNodeType: action,
		setEdgeType: action,
		removeEdgeType: action
	}
);