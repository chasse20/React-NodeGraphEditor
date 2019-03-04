import { action, decorate, observable, set, remove, get, has, values } from "mobx";
import Vector2D from "../../core/Vector2D";

export default class Graph
{
	constructor()
	{
		this._nodes = {};
		this._nodesCount = 0;
		this._selectedNodes = {};
		this._selectedNodesCount = 0;
		this._selectedEdges = {};
		this._selectedEdgesCount = 0;
		this._nodeTypes = {};
		this._edgeTypes = {};
		this.position = new Vector2D();
		this.zoom = 1;
		this.zoomSpeed = 0.05;
		this.minZoom = 0.1;
		this.maxZoom = 1;
		this.isPanning = false;
		this.isMarqueeing = false;
		this.isPanMode = false;
		this.gridSize = 100;
		this.gridSnapIncrement = 5;
		this.isGridVisible = false;
		this.isGridSnap = false;
	}
	
	setNode( tNode )
	{
		if ( tNode != null && !has( this._nodes, tNode._id ) )
		{
			set( this._nodes, tNode._id, tNode );
			
			return true;
		}
		
		return false;
	}
	
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
	
	setSelectedNode( tNode )
	{
		if ( tNode != null && !has( this._selectedNodes, tNode._id ) )
		{
			set( this._selectedNodes, tNode._id, tNode );
			++this._selectedNodesCount;
			
			tNode._isSelected = true;
			
			return true;
		}
		
		return false;
	}
	
	removeSelectedNode( tNode )
	{
		if ( tNode != null && tNode === get( this._selectedNodes, tNode._id ) )
		{
			remove( this._selectedNodes, tNode._id );
			--this._selectedNodesCount;
			
			tNode._isSelected = false;

			return true;
		}
		
		return false;
	}
	
	clearSelectedNodes()
	{
		const tempNodes = values( this._selectedNodes );
		for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
		{
			this.removeSelectedNode( tempNodes[i] );
		}
	}
	
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
	
	clearSelectedEdges()
	{
		const tempEdges = values( this._selectedEdges );
		for ( let i = ( tempEdges.length - 1 ); i >= 0; --i )
		{
			this.removeSelectedEdge( tempEdges[i] );
		}
	}
	
	setNodeType( tType )
	{
		if ( tType != null && !has( this._nodeTypes, tType._name ) )
		{
			set( this._nodeTypes, tType._name, tType );
			
			return true;
		}
		
		return false;
	}
	
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
	
	setEdgeType( tType )
	{
		if ( tType != null && !has( this._edgeTypes, tType._name ) )
		{
			set( this._edgeTypes, tType._name, tType );
			
			return true;
		}
		
		return false;
	}
	
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
		_selectedNodes: observable.shallow,
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
		setSelectedNode: action,
		removeSelectedNode: action,
		clearSelectedNodes: action,
		setSelectedEdge: action,
		removeSelectedEdge: action,
		clearSelectedEdges: action,
		setNodeType: action,
		removeNodeType: action,
		setEdgeType: action,
		removeEdgeType: action
	}
);