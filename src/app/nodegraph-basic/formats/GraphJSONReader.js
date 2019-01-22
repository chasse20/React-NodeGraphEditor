import GraphJSONReaderBase from "../../nodegraph/formats/GraphJSONReader";
import Node from "../models/Node";
import NodeType from "../models/NodeType";
import EdgeType from "../models/EdgeType";

export default class GraphJSONReader extends GraphJSONReaderBase
{
	readNode( tGraphModel, tJSON, tTextField = "caption" )
	{
		const tempNode = super.readNode( tGraphModel, tJSON );
		
		// Data
		if ( tempNode != null )
		{
			delete tJSON.type;
			var tempData = null;
			
			const tempText = tJSON[ tTextField ];
			if ( tempText != null )
			{
				tempNode.text = tempText;				
				delete tJSON[ tTextField ];
			}
			
			for ( let tempField in tJSON )
			{
				if ( tempField !== "id" ) // still need this for post linking
				{
					if ( tempData === null )
					{
						tempData = {};
					}
					tempData[ tempField ] = tJSON[ tempField ];
				}
			}
			
			if ( tempData !== null )
			{
				tempNode.data = Object.assign( tempNode.data, tempData ); // merge/overwrite!
			}
		}
		
		return tempNode;
	}
	
	createNodeType( tName, tViewClass )
	{
		return new NodeType( tName, tViewClass );
	}
	
	createNode( tType )
	{
		return new Node( tType );
	}
	
	createEdgeType( tName, tViewClass )
	{
		return new EdgeType( tName, tViewClass );
	}
}