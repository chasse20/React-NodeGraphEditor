import { decorate, action } from "mobx";
import PinBase from "../../nodegraph-base/models/Pin";

/**
*	Pin model that manages all edge links
*	@memberof nodegraph
*	@augments nodegraph-base.Pin
*	@param {string} tName Key name of the pin used for lookups in its owning node
*	@param {Node} tNode Node instance that this pin is coupled to
*	@param {bool} [tIsOut=true] Direction of this pin
*	@param {Object|TypeEdge} [tEdgeTypes=null] Allowed edge types that get checked for compatability when creating links with other pins. Null can connect to null. If target pin types set to null, anything can connect.
*	@param {core.Vector2D} [tOffset] Relative offset position from the pin's node
*/
export default class Pin extends PinBase
{
	/**
	*	Adds an edge link to the pin and notifies the physics system
	*	@param {Edge} tEdge Edge link to add
	*	@param {bool} [tIsFromOther=false] Optimization flag that gets set when coming from another pin's linking method
	*	@return {bool} True if added
	*/
	setLink( tEdge, tIsFromOther = false )
	{
		if ( super.setLink( tEdge, tIsFromOther ) )
		{
			this._node._graph._physics.onSetEdge( tEdge );
			
			return true;
		}

		return false;
	}
	
	/**
	*	Removes an edge link from the pin, ensures its deselected from the graph, and notifies the physics system
	*	@param {Edge} tEdge Edge link to remove
	*	@return {bool} True if removed
	*/
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