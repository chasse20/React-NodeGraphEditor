import { observable, decorate } from "mobx";
import TypeBase from "../../nodegraph/models/Type";

export default class NodeType extends TypeBase
{
	constructor( tName, tViewClass = null, tRadius = 50, tStroke = "#808080", tFill = "#a9a9a9" )
	{
		super( tName, tViewClass );
		
		this.radius = tRadius;
		this.stroke = tStroke;
		this.fill = tFill;
	}
}

decorate( NodeType,
	{
		radius: observable,
		stroke: observable,
		fill: observable
	}
);