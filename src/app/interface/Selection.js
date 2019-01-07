import { decorate, observable, action } from "mobx";

export default class Selection
{
	constructor( tIsPanMode = false, tIsSnapMode = false, tSnapIncrement = 5 )
	{
		this.isPanMode = tIsPanMode;
		this.isPanningHeld = false;
		this.isMarqueeHeld = false;
		this.isSnapMode = tIsSnapMode;
		this.snapIncrement = tSnapIncrement;
		this._nodes = []; // TODO: consider making this hash for performance!
	}
	
	addNode( tNode ) // TODO: Reorder newest selection models in Graph!
	{
		if ( tNode != null && this._nodes.indexOf( tNode ) < 0 )
		{
			this._nodes.push( tNode );
			
			tNode.isSelected = true;
			
			return true;
		}
		
		return false;
	}
	
	removeNode( tNode )
	{
		if ( tNode != null && this._nodes !== null )
		{
			const tempIndex = this._nodes.indexOf( tNode );
			if ( tempIndex >= 0 )
			{
				this._nodes.splice( tempIndex, 1 );
				
				tNode.isSelected = false;
				
				return true;
			}
		}
		
		return false;
	}
	
	clearNodes()
	{
		for ( let i = ( this._nodes.length - 1 ); i >= 0; --i )
		{
			this._nodes[i].isSelected = false;
		}
		
		this._nodes.clear();
	}
}

decorate( Selection,
	{
		isPanMode: observable,
		isPanningHeld: observable,
		isSnapMode: observable,
		isMarqueeHeld: observable,
		_nodes: observable.shallow,
		addNode: action,
		removeNode: action,
		clearNodes: action
	}
);