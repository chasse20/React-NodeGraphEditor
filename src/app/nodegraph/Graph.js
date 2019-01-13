import { action, decorate, observable, set, remove } from "mobx";
import Vector2D from "../core/Vector2D";
import Type from "./Type";
import Edge from "./Edge";
import EdgeView from "./views/graph/edges/edge/Edge";
import Node from "./Node";
import NodeView from "./views/graph/nodes/node/Node";

export default class Graph
{
	constructor()
	{
		this._nodes = {};
		this._nodeTypes =
		{
			"default": new Type( Node, NodeView )
		};
		this._edgeTypes =
		{
			"default": new Type( Edge, EdgeView )
		};
		this._position = new Vector2D();
		this._zoom = 1;
		this.isPanMode = false;
		this.isPanning = false;
		this.isMarquee = false;
		this.isGridVisible = true;
		this.isGridSnap = false;
	}
	
	setNode( tNode )
	{
		if ( tNode != null  )
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
			remove( this._nodes, tNode._id );

			return true;
		}
		
		return false;
	}
	
	setNodeType( tName, tType )
	{
		if ( tName != null && tType != null  )
		{
			set( this._nodeTypes, tName, tType );
			
			return true;
		}
		
		return false;
	}
	
	removeNodeType( tName )
	{
		if ( tName != null )
		{
			const tempType = this._nodeTypes[ tName ];
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

				remove( this._nodeTypes, tName );
				
				return true;
			}
		}
		
		return false;
	}
	
	setEdgeType( tName, tType )
	{
		if ( tName != null && tType != null  )
		{
			set( this._edgeTypes, tName, tType );
			
			return true;
		}
		
		return false;
	}
	
	removeEdgeType( tName )
	{
		if ( tName != null )
		{
			const tempType = this._edgeTypes[ tName ];
			if ( tempType !== undefined )
			{
				// Remove edges that belong to the type
				for ( let tempID in this._nodes )
				{
					this._nodes[ tempID ].removeEdgeType( tempType );
				}
				
				remove( this._edgeTypes, tName );

				return true;
			}
		}
		
		return false;
	}
}

decorate( Graph,
	{
		_nodes: observable.shallow,
		_nodeTypes: observable.shallow,
		_edgeTypes: observable.shallow,
		_position: observable,
		_zoom: observable,
		isPanMode: observable,
		isPanning: observable,
		isMarquee: observable,
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