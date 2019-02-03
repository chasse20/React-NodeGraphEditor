import Type from "./Type";
import Node from "./Node";
import NodeView from "../views/graph/node/Node";

export default class TypeNode extends Type
{
	constructor( tName = "default", tModelClass = Node, tViewClass = NodeView )
	{
		super( tName, tModelClass, tViewClass );
	}
}