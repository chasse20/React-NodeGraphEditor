import { observable, decorate } from "mobx";
import TypeEdgeBase from "../../nodegraph/models/TypeEdge";
import Edge from "../../nodegraph/models/Edge";
import EdgeView from "../views/graph/Edge";

export default class TypeEdge extends TypeEdgeBase
{
	constructor( tName = "default", tModelClass = Edge, tViewClass = EdgeView, tStroke = "#808080", tText = "" )
	{
		super( tName, tModelClass, tViewClass );
		
		this.isVisible = true;
		this.stroke = tStroke;
		this.text = tText;
	}
}

decorate( TypeEdge,
	{
		isVisible: observable,
		stroke: observable,
		text: observable
	}
);