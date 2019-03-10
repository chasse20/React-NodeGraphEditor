import Type from "./Type";
import Edge from "./Edge";
import EdgeView from "../views/graph/edges/Edge";

/**
*	Type model definition
*	@memberof nodegraph-base
*	@param {string} [tName] Key name of this type used for lookups in the graph
*	@param {Object} [tModelClass=default] Model class of this type
*	@param {Object} [tViewClass] View class of this type
*/
export default class TypeEdge extends Type
{
	constructor( tName = "default", tModelClass = Edge, tViewClass = EdgeView )
	{
		super( tName, tModelClass, tViewClass );
	}
}