import { decorate, observable, action } from "mobx";

export default class Selection
{
	constructor( tIsPanning = true, tIsSnapping = false )
	{
		this.isPanning = tIsPanning;
		this.isSnapping = tIsSnapping;
		this._nodeIDs = [];
	}
	
	addNodeID( tID )
	{
		if ( tID != null )
		{
			this._nodeIDs.push( tID );
			
			return true;
		}
		
		return false;
	}
	
	removeNodeID( tID )
	{
		if ( tID != null )
		{
			return this._nodeIDs.remove( tID );
		}
		
		return false;
	}
}

decorate( Selection,
	{
		isPanning: observable,
		isSnapping: observable,
		_nodeIDs: observable.shallow,
		addNodeID: action,
		removeNodeID: action
	}
);