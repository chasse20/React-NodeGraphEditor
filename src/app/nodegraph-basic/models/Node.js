import { observable, decorate } from "mobx";
import NodeBase from "../../nodegraph/models/Node";

export default class Node extends NodeBase
{
	constructor( tType, tText = "", tData = {} )
	{
		super( tType );
		
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