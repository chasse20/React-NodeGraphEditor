import GraphJSONReaderBase from "../../nodegraph-base/formats/GraphJSONReader";
import TypeNode from "../models/TypeNode";
import TypeEdge from "../models/TypeEdge";

export default class GraphJSONReader extends GraphJSONReaderBase
{
	readNode( tGraphModel, tJSON, tTextField = "caption" )
	{
		const tempNode = super.readNode( tGraphModel, tJSON, tTextField );
		
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
	
	createNodeType( tName, tModelClass, tViewClass )
	{
		return new TypeNode( tName, tModelClass, tViewClass );
	}
	
	readEdgeType( tJSON, tTextField = "caption" )
	{
		const tempType = super.readEdgeType( tJSON, tTextField );
		
		if ( tempType != null )
		{
			// Text
			const tempText = tJSON[ tTextField ];
			if ( tempText != null )
			{
				tempType.text = tempText;
			}
		}
		
		return tempType;
	}
	
	createEdgeType( tName, tModelClass, tViewClass )
	{
		return new TypeEdge( tName, tModelClass, tViewClass );
	}
}