import { decorate, observable } from "mobx";
import GraphBase from "../../nodegraph-base/models/Graph";
import Physics from "./Physics";

export default class Graph extends GraphBase
{
	constructor()
	{
		super();
		
		this.linkingPin = null;
		this._physics = new Physics( this );
	}
}

decorate( Graph,
	{
		linkingPin: observable.ref
	}
);