import { values } from "mobx";
import GraphModel from "../../nodegraph/Graph";
import NodeModel from "../../nodegraph/Node";
import NodeView from "../../nodegraph/views/Node";
import EdgeModel from "../../nodegraph/Edge";
import EdgeView from "../../nodegraph/views/Edge";
import Transform2D from "./Transform2D";
import Type from "./Type";
import Node from "./Node";

export default class Graph
{
	static FromJSON( tJSON, tVersion )
	{
		if ( tJSON != null )
		{
			const tempGraph = new GraphModel();
			Graph.Read( tempGraph, tJSON, tVersion );
			
			return tempGraph;
		}
		
		return null;
	}
	
	static Read( tGraphModel, tJSON, tVersion )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			Transform2D.Read( tGraphModel._transform, tJSON.transform, tVersion );
			Graph.ReadNodeTypes( tGraphModel, tJSON.nodeTypes, tVersion );
			Graph.ReadEdgeTypes( tGraphModel, tJSON.edgeTypes, tVersion );
			Graph.ReadNodes( tGraphModel, tJSON.nodes, tVersion );
		}
	}
	
	static ReadNodeTypes( tGraphModel, tJSON, tVersion )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			const tempListLength = tJSON.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				tGraphModel.setNodeType( Type.FromJSON( tJSON[i], NodeModel.SerializableClasses, NodeView.SerializableClasses, tVersion ) );
			}
		}
	}
	
	static ReadEdgeTypes( tGraphModel, tJSON, tVersion )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			const tempListLength = tJSON.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				tGraphModel.setEdgeType( Type.FromJSON( tJSON[i], EdgeModel.SerializableClasses, EdgeView.SerializableClasses, tVersion ) );
			}
		}
	}
	
	static ReadNodes( tGraphModel, tJSON, tVersion )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			// Pre
			const tempNodeJSONs = {};
			const tempNodeRefs = {};
			const tempListLength = tJSON.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				let tempNodeJSON = tJSON[i];
				let tempNode = Node.FromJSON( tempNodeJSON, tGraphModel._nodeTypes, tVersion );
				if ( tGraphModel.setNode( tempNode ) )
				{
					tempNodeJSONs[ tempNode._id ] = tempNodeJSON;
					tempNodeRefs[ tempNodeJSON.id ] = tempNode;
				}
			}
			
			// Post with references
			for ( let tempID in tempNodeRefs )
			{
				Node.ReadPost( tempNodeRefs[ tempID ], tempNodeJSONs[ tempNodeRefs[ tempID ]._id ], tempNodeRefs, tGraphModel._edgeTypes, tVersion );
			}
		}
	}
	
	static Write( tGraphModel )
	{
		if ( tGraphModel != null )
		{
			var tempJSON = null;
			
			// Transform
			const tempTransform = Transform2D.Write( tGraphModel._transform );
			if ( tempTransform != null )
			{
				tempJSON = { transform: tempTransform };
			}
			
			// Node types
			var tempArray = Graph.WriteTypes( values( tGraphModel._nodeTypes ), NodeModel.SerializableClasses, NodeView.SerializableClasses );
			if ( tempArray != null )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.nodeTypes = tempArray;
			}
			
			// Edge types
			tempArray = Graph.WriteTypes( values( tGraphModel._edgeTypes ), EdgeModel.SerializableClasses, EdgeView.SerializableClasses );
			if ( tempArray != null )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.edgeTypes = tempArray;
			}
			
			// Nodes
			tempArray = Graph.WriteNodes( values( tGraphModel._nodes ) );
			if ( tempArray != null )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.nodes = tempArray;
			}
			
			return tempJSON;
		}
		
		return null;
	}
	
	static WriteTypes( tTypes, tSerializableModels, tSerializableViews )
	{
		if ( tTypes != null && tSerializableModels != null && tSerializableViews != null )
		{
			const tempListLength = tTypes.length;
			if ( tempListLength > 0 )
			{
				var tempTypes = null;
				for ( let i = ( tempListLength - 1 ); i >= 0; --i )
				{
					if ( tTypes[i]._name !== "default" )
					{
						if ( tempTypes === null )
						{
							tempTypes = [];
						}
						tempTypes.push( Type.Write( tTypes[i], tSerializableModels, tSerializableViews ) );
					}
				}
				
				return tempTypes;
			}
		}
		
		return null;
	}
	
	static WriteNodes( tNodes )
	{
		if ( tNodes != null )
		{
			const tempListLength = tNodes.length;
			if ( tempListLength > 0 )
			{
				const tempNodes = [];
				for ( let i = ( tempListLength - 1 ); i >= 0; --i )
				{
					tempNodes.push( Node.Write( tNodes[i] ) );
				}
				
				return tempNodes;
			}
		}
		
		return null;
	}
}