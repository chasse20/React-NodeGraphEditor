import Type from "./Type";
import Edge from "./Edge";
import EdgeView from "../views/graph/edges/Edge";

/**
*	Edge type definition
*	@memberof nodegraph-base
*	@augments nodegraph-base.Type
*	@param {string} [tName=default] Key name of this type used for lookups in the graph
*	@param {Object} [tModelClass] Model class of this type
*	@param {Object} [tViewClass] View class of this type
*/
export default class TypeEdge extends Type
{
	constructor( tName = "default", tModelClass = Edge, tViewClass = EdgeView )
	{
		super( tName, tModelClass, tViewClass );
	}
}