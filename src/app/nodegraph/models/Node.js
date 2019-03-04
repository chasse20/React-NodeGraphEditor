import { observable, decorate } from "mobx";
import NodeBase from "../../nodegraph-base/models/Node";
import Pin from "./Pin";

export default class Node extends NodeBase
{
	constructor( tGraph, tType, tText = "", tData = {} )
	{
		super( tGraph, tType );
		
		this._pins =
		{
			in: new Pin( "in", this, false ),
			out: new Pin( "out", this )
		};
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