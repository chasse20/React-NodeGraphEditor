import { decorate, observable } from "mobx";
import GraphBase from "../../nodegraph-base/models/Graph";

export default class Graph extends GraphBase
{
	constructor()
	{
		super();
		
		this.linkingPin = null;
		this.isPhysics = false;
	}
}

decorate( Graph,
	{
		linkingPin: observable.ref,
		isPhysics: observable
	}
);