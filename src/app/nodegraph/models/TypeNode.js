import { observable, decorate } from "mobx";
import TypeNodeBase from "../../nodegraph-base/models/TypeNode";
import Node from "./Node";
import NodeView from "../views/graph/nodes/Node";

export default class TypeNode extends TypeNodeBase
{
	constructor( tName = "default", tModelClass = Node, tViewClass = NodeView, tRadius = 50, tFill = "#a9a9a9" )
	{
		super( tName, tModelClass, tViewClass );
		
		this.isVisible = true;
		this.radius = tRadius;
		this.fill = tFill;
	}
}

decorate( TypeNode,
	{
		isVisible: observable,
		radius: observable,
		fill: observable
	}
);