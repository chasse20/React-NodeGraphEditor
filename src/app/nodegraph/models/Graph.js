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
	
	setNode( tNode )
	{
		if ( super.setNode( tNode ) )
		{
			this._physics.onSetNode( tNode );
			
			return true;
		}
		
		return false;
	}
	
	removeNode( tNode )
	{
		if ( super.removeNode( tNode ) )
		{
			this._physics.onRemoveNode( tNode );

			return true;
		}
		
		return false;
	}
}

decorate( Graph,
	{
		linkingPin: observable.ref
	}
);