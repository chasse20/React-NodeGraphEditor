import { observable, decorate } from "mobx";
import TypeBase from "../../nodegraph/models/Type";

export default class EdgeType extends TypeBase
{
	constructor( tName, tViewClass = null, tStroke = "#a9a9a9", tText = "" )
	{
		super( tName, tViewClass );
		
		this.stroke = tStroke;
		this.text = tText;
	}
}

decorate( EdgeType,
	{
		stroke: observable,
		text: observable
	}
);