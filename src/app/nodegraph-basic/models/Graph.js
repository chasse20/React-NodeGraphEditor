import GraphBase from "../../nodegraph/models/Graph";
import NodeType from "./NodeType";
import EdgeType from "./EdgeType";

export default class Graph extends GraphBase
{
	constructor()
	{
		super();
		
		this._nodeTypes[ "default" ] = new NodeType( "default" );
		this._edgeTypes[ "default" ] = new EdgeType( "default" );
	}
}