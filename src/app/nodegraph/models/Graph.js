import { action, decorate, observable, set, remove } from "mobx";
import Vector2D from "../../core/Vector2D";
import Type from "./Type";

export default class Graph
{
	constructor()
	{
		this._nodes = {};
		this._selectedNodes = [];
		this._nodeTypes =
		{
			"default": new Type( "default" )
		};
		this._edgeTypes =
		{
			"default": new Type( "default" )
		};
		this.position = new Vector2D();
		this.zoom = 1;
		this.zoomSpeed = 0.05;
		this.minZoom = 0.1;
		this.maxZoom = 1;
		this.isPanning = false;
		this.isMarqueeing = false;
		this.isPanMode = false;
		this.gridSize = 80;
		this.gridSnapIncrement = 5;
		this.isGridVisible = true;
		this.isGridSnap = false;
	}
	
	setNode( tNode )
	{
		if ( tNode != null )
		{
			set( this._nodes, tNode._id, tNode );
			
			return true;
		}
		
		return false;
	}
	
	removeNode( tNode )
	{
		if ( tNode != null && this._nodes[ tNode._id ] !== undefined )
		{
			this.removeSelectedNode( tNode );
			remove( this._nodes, tNode._id );

			return true;
		}
		
		return false;
	}
	
	setSelectedNode( tNode )
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
	
	setNodeType( tType )
	{
		if ( tType != null  )
		{
			set( this._nodeTypes, tType._name, tType );
			
			return true;
		}
		
		return false;
	}
	
	removeNodeType( tType )
	{
		if ( tType != null )
		{
			const tempType = this._nodeTypes[ tType._name ];
			if ( tempType !== undefined )
			{
				// Remove nodes that belong to the type
				for ( let tempID in this._nodes )
				{
					let tempNode = this._nodes[ tempID ];
					if ( tempNode._type === tempType )
					{
						this.removeNode( tempNode );
					}
				}

				remove( this._nodeTypes, tType._name );
				
				return true;
			}
		}
		
		return false;
	}
	
	setEdgeType( tType )
	{
		if ( tType != null  )
		{
			set( this._edgeTypes, tType._name, tType );
			
			return true;
		}
		
		return false;
	}
	
	removeEdgeType( tType )
	{
		if ( tType != null )
		{
			const tempType = this._edgeTypes[ tType._name ];
			if ( tempType !== undefined )
			{
				// Remove edges that belong to the type
				for ( let tempID in this._nodes )
				{
					this._nodes[ tempID ].removeEdgeType( tempType );
				}
				
				remove( this._edgeTypes, tType._name );

				return true;
			}
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