import { decorate, observable } from "mobx";
import GraphBase from "../../nodegraph/models/Graph";

export default class Graph extends GraphBase
{
	constructor()
	{
		super();
		
		this.isPhysics = false;
	}
}

decorate( Graph,
	{
		isPhysics: observable
	}
);