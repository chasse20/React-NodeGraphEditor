import { action, decorate, observable, set, remove, has, values } from "mobx";
import Transform2D from "../core/Transform2D";
import Type from "./Type";
import Edge from "./Edge";
import EdgeView from "./views/Edge";
import Node from "./Node";
import NodeView from "./views/Node";
import Vector2D from "../core/Vector2D";

export default class Graph
{
	constructor()
	{
		this._nodes = {};
		this._nodeTypes =
		{
			"default": new Type( "default", Node, NodeView )
		};
		this._edgeTypes =
		{
			"default": new Type( "default", Edge, EdgeView )
		};
		this._transform = new Transform2D();
		this.isSelected = false;
	}
	
	setNode( tNode )
	{
		if ( tNode != null  )
		{
			tNode._transform.parent = this._transform;
			set( this._nodes, tNode._id, tNode );
			
			return true;
		}
		
		return false;
	}
	
	removeNode( tNode )
	{
		if ( tNode != null && has( this._nodes, tNode._id ) )
		{
			tNode._transform.parent = null;
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
		if ( tType != null && has( this._nodeTypes, tType._name ) )
		{
			// Remove nodes that belong to the type
			const tempNodes = values( this._nodes );
			for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
			{
				let tempNode = tempNodes[i];
				if ( tempNode._type === tType )
				{
					this.removeNode( tempNode );
				}
			}

			remove( this._nodeTypes, tType._name );
			
			return true;
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
		if ( tType != null && has( this._edgeTypes, tType._name ) )
		{
			// Remove edges that belong to the type
			const tempNodes = values( this._nodes );
			for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
			{
				tempNodes[i].removeEdgeType( tType );
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
		_nodeTypes: observable.shallow,
		_edgeTypes: observable.shallow,
		isSelected: observable,
		setNode: action,
		removeNode: action,
		setNodeType: action,
		removeNodeType: action,
		setEdgeType: action,
		removeEdgeType: action
	}
);