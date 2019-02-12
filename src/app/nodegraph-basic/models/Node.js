import { observable, decorate } from "mobx";
import NodeBase from "../../nodegraph/models/Node";

export default class Node extends NodeBase
{
	constructor( tGraph, tType, tText = "", tData = {} )
	{
		super( tGraph, tType );
		
		this.text = tText;
		this.data = tData;
	}
}

decorate( Node,
	{
		text: observable,
		data: observable
	}
);