import { observable, decorate } from "mobx";
import TypeEdgeBase from "../../nodegraph/models/TypeEdge";
import Edge from "../../nodegraph/models/Edge";
import EdgeView from "../views/graph/edge/Edge";

export default class TypeEdge extends TypeEdgeBase
{
	constructor( tName = "default", tModelClass = Edge, tViewClass = EdgeView, tStroke = "#808080", tText = "" )
	{
		super( tName, tModelClass, tViewClass );
		
		this.stroke = tStroke;
		this.text = tText;
	}
}

decorate( TypeEdge,
	{
		stroke: observable,
		text: observable
	}
);