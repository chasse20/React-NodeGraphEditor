import Type from "./Type";
import Edge from "./Edge";
import EdgeView from "../views/graph/Edge";

export default class TypeEdge extends Type
{
	constructor( tName = "default", tModelClass = Edge, tViewClass = EdgeView )
	{
		super( tName, tModelClass, tViewClass );
	}
}