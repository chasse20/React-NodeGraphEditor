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
	
	toJSON()
	{
		var tempJSON = null;

		// Transform
		const tempTransform = this._transform.toJSON();
		if ( tempTransform != null )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.transform = tempTransform;
		}
		
		// Node Types
		var tempArray = values( this._nodeTypes );
		if ( tempArray.length > 0 )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.nodeTypes = tempArray;
		}
		
		// Edge Types
		tempArray = values( this._edgeTypes );
		if ( tempArray.length > 0 )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.edgeTypes = tempArray;
		}

		// Nodes
		tempArray = values( this._nodes );
		if ( tempArray.length > 0 )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.nodes = tempArray;
		}
		
		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			this._transform.fromJSON( tJSON.transform );
			
			// Node Types
			if ( tJSON.nodeTypes !== undefined )
			{
				const tempListLength = tJSON.nodeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					this.setNodeType( Type.FromJSON( tJSON.nodeTypes[i], Node.SerializableClasses, NodeView.SerializableClasses ) );
				}
			}
			
			// Edge Types
			if ( tJSON.edgeTypes !== undefined )
			{
				const tempListLength = tJSON.edgeTypes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					this.setEdgeType( Type.FromJSON( tJSON.edgeTypes[i], Edge.SerializableClasses, EdgeView.SerializableClasses ) );
				}
			}
			
			// Nodes
			/*const tempTestAmount = 20;
			for ( let i = tempTestAmount; i >= 0; --i )
			{ 
				let tempNode = Node.CreateFromType( this._nodeTypes[ "default" ], { text: Math.floor( Math.random() * tempTestAmount ) } );
				tempNode._transform._position = new Vector2D( Math.random() * 5000, Math.random() * 5000 );
				this.setNode( tempNode );
			}*/
			
			if ( tJSON.nodes !== undefined )
			{
				const tempNodeJSONs = {};
				const tempNodeRefs = {};
				const tempListLength = tJSON.nodes.length;
				for ( let i = 0; i < tempListLength; ++i )
				{
					let tempNodeJSON = tJSON.nodes[i];
					let tempNode = Node.CreateFromJSON( tempNodeJSON, this._nodeTypes, this._nodeTypes[ "default" ] );
					if ( this.setNode( tempNode ) )
					{
						tempNodeJSONs[ tempNode._id ] = tempNodeJSON;
						tempNodeRefs[ tempNodeJSON.id ] = tempNode;
					}
				}
				
				// Post
				const tempNodes = values( this._nodes );
				for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
				{
					tempNodes[i].fromJSONPost( tempNodeJSONs[ tempNodes[i]._id ], tempNodeRefs, this._edgeTypes, this._edgeTypes[ "default" ] );
				}
			}
			
			/*for ( let i = tempTestAmount - 1; i >= 0; --i )
			{
				let tempPinOut = this._nodes[i + 1]._pins.out;
				tempPinOut.setLink( Edge.CreateFromType( this._edgeTypes[ "default" ], tempPinOut, this._nodes[ i + 2 ]._pins.in ) );
			}*/
			
			/*setTimeout(
				() =>
				{
					this.removeNodeType( this._nodeTypes[ "default" ] );
					//this.removeEdgeType( this._edgeTypes[ "default" ] );
				},
				2000
			);*/
		}
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
		fromJSON: action,
		setNode: action,
		removeNode: action,
		setNodeType: action,
		removeNodeType: action,
		setEdgeType: action,
		removeEdgeType: action
	}
);