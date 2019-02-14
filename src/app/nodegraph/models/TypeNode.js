import Type from "./Type";
import Node from "./Node";
import NodeView from "../views/graph/nodes/Node";

export default class TypeNode extends Type
{
	constructor( tName = "default", tModelClass = Node, tViewClass = NodeView )
	{
		super( tName, tModelClass, tViewClass );
	}
}