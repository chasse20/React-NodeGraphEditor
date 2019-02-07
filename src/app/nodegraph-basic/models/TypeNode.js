import { observable, decorate } from "mobx";
import TypeNodeBase from "../../nodegraph/models/TypeNode";
import Node from "./Node";
import NodeView from "../views/graph/node/Node";

export default class TypeNode extends TypeNodeBase
{
	constructor( tName = "default", tModelClass = Node, tViewClass = NodeView, tRadius = 50, tStroke = "#808080", tFill = "#a9a9a9" )
	{
		super( tName, tModelClass, tViewClass );
		
		this.radius = tRadius;
		this.stroke = tStroke;
		this.fill = tFill;
	}
}

decorate( TypeNode,
	{
		radius: observable,
		stroke: observable,
		fill: observable
	}
);