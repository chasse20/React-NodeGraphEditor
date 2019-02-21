import { decorate, observable } from "mobx";
import GraphBase from "../../nodegraph/models/Graph";

export default class Graph extends GraphBase
{
	constructor()
	{
		super();
		
		this._selectedEdges = [];
		this.linkingPin = null;
		this.isPhysics = true;
	}
}

decorate( Graph,
	{
		_selectedEdges: observable.shallow,
		linkingPin: observable.ref,
		isPhysics: observable
	}
);