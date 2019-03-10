import Type from "./Type";
import Node from "./Node";
import NodeView from "../views/graph/nodes/Node";

/**
*	Node type definition
*	@memberof nodegraph-base
*	@augments nodegraph-base.Type
*	@param {string} [tName=default] Key name of this type used for lookups in the graph
*	@param {Object} [tModelClass] Model class of this type
*	@param {Object} [tViewClass] View class of this type
*/
export default class TypeNode extends Type
{
	constructor( tName = "default", tModelClass = Node, tViewClass = NodeView )
	{
		super( tName, tModelClass, tViewClass );
	}
}