import { decorate, action } from "mobx";
import PinBase from "../../nodegraph-base/models/Pin";

export default class Pin extends PinBase
{
	setLink( tEdge, tIsFromOther = false )
	{
		if ( super.setLink( tEdge, tIsFromOther ) )
		{
			this._node._graph._physics.onSetEdge( tEdge );
			
			return true;
		}

		return false;
	}
	
	removeLink( tEdge )
	{
		if ( super.removeLink( tEdge ) )
		{
			this._node._graph._physics.onRemoveEdge( tEdge );
			
			return true;
		}
		
		return false;
	}
}

decorate( Pin,
	{
		setLink: action,
		removeLink: action,
	}
);