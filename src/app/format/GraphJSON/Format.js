import Graph from "./Graph";

export default class Format
{
	static Read( tGraphModel, tJSON )
	{
		if ( tGraphModel != null && tJSON != null )
		{
			Graph.Read( tGraphModel, tJSON.graph, tJSON.version );
		}
	}
	
	static Write( tGraphModel )
	{
		const tempJSON =
		{
			version: 1
		};
		
		const tempGraph = Graph.Write( tGraphModel );
		if ( tempGraph != null )
		{
			tempJSON.graph = tempGraph;
		}
		
		return tempJSON;
	}
}