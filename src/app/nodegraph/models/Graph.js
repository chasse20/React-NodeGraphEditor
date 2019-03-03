import { decorate, observable, remove, values } from "mobx";
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
	
	setSelectedNode( tNode )
	{
		if ( super.setSelectedNode( tNode ) )
		{
			this._physics.onSelectNode( tNode );
			
			return true;
		}
		
		return false;
	}
	
	removeSelectedNode( tNode )
	{
		if ( super.removeSelectedNode( tNode ) )
		{
			this._physics.onDeselectNode( tNode );

			return true;
		}
		
		return false;
	}
	
	clearSelectedNodes()
	{
		const tempNodes = values( this._selectedNodes );
		for ( let i = ( tempNodes.length - 1 ); i >= 0; --i )
		{
			let tempNode = tempNodes[i];
			tempNode._isSelected = false;
			remove( this._selectedNodes, tempNode._id );
			this._physics.onDeselectNode( tempNode );
		}
		
		this._selectedNodesCount = 0;
	}
}

decorate( Graph,
	{
		linkingPin: observable.ref
	}
);