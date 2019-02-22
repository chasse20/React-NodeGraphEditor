import { action, decorate, observable, set, remove, get, has, values } from "mobx";
import Vector2D from "../../core/Vector2D";

export default class Graph
{
	constructor()
	{
		this._nodes = {};
		this._selectedNodes = [];
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
		this.isGridVisible = true;
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
			this.removeSelectedNode( tNode );
			remove( this._nodes, tNode._id );

			return true;
		}
		
		return false;
	}
	
	addSelectedNode( tNode )
	{
		if ( tNode != null && this._selectedNodes.indexOf( tNode ) === -1 )
		{
			this._selectedNodes.push( tNode );
			tNode._isSelected = true;
			
			return true;
		}
		
		return false;
	}
	
	removeSelectedNode( tNode )
	{
		if ( tNode != null && this._selectedNodes.remove( tNode ) )
		{
			tNode._isSelected = false;

			return true;
		}
		
		return false;
	}
	
	clearSelectedNodes()
	{
		for ( let i = ( this._selectedNodes.length - 1 ); i >= 0; --i )
		{
			this._selectedNodes[i]._isSelected = false;
		}
		
		this._selectedNodes.clear();
	}
	
	addSelectedEdge( tEdge )
	{
		if ( tEdge != null && this._selectedEdges.indexOf( tEdge ) === -1 )
		{
			this._selectedEdges.push( tEdge );
			tEdge._isSelected = true;
			
			return true;
		}
		
		return false;
	}
	
	removeSelectedEdge( tEdge )
	{
		if ( tEdge != null && this._selectedEdges.remove( tEdge ) )
		{
			tEdge._isSelected = false;

			return true;
		}
		
		return false;
	}
	
	clearSelectedEdges()
	{
		for ( let i = ( this._selectedEdges.length - 1 ); i >= 0; --i )
		{
			this._selectedEdges[i]._isSelected = false;
		}
		
		this._selectedEdges.clear();
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
		setNodeType: action,
		removeNodeType: action,
		setEdgeType: action,
		removeEdgeType: action
	}
);