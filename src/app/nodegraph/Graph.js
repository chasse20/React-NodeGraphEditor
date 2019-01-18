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
			"default": new Type( "default", Node, NodeView,
				{
					radius: 50,
					fill: "#2891ca",
					stroke: "#1f729f"
				}
			)
		};
		this._edgeTypes =
		{
			"default": new Type( "default", Edge, EdgeView,
				{
					stroke: "#1f729f"
				}
			)
		};
		this.position = new Vector2D();
		this.zoom = 1;
		this.isPanMode = false;
		this.isPanning = false;
		this.isMarquee = false;
		this.gridSize = 80;
		this.isGridVisible = true;
		this.isGridSnap = false;
		this.isPhysics = true;
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
		_nodeTypes: observable.shallow,
		_edgeTypes: observable.shallow,
		position: observable,
		zoom: observable,
		isPanMode: observable,
		isPanning: observable,
		isMarquee: observable,
		gridSize: observable,
		isGridVisible: observable,
		isGridSnap: observable,
		isPhysics: observable,
		setNode: action,
		removeNode: action,
		setNodeType: action,
		removeNodeType: action,
		setEdgeType: action,
		removeEdgeType: action
	}
);