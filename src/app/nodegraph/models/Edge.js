import { observable, decorate } from "mobx";
import EdgeBase from "../../nodegraph-base/models/Edge";

export default class Edge extends EdgeBase
{
	constructor( tType, tSource, tTarget, tWeight = 1.0, tData = {} )
	{
		super( tType, tSource, tTarget );
		
		this.weight = tWeight;
		this.data = tData;
	}
}

decorate( Edge,
	{
		weight: observable,
		data: observable
	}
);