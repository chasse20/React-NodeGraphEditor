import { decorate, observable } from "mobx";
import GraphBase from "../../nodegraph-base/models/Graph";
import Physics from "./Physics";

/**
*	Graph model responsible for tracking nodes, selections, and interactive states
*	@memberof nodegraph
*	@augments nodegraph-base.Graph
*/
export default class Graph extends GraphBase
{
	constructor()
	{
		super();
		
		/**
		*	State variable used for tracking the interaction of a pin connecting to another
		*	@type {Pin}
		*/
		this.linkingPin = null;
		/**
		*	Physics system used for node auto-placement
		*	@type {Physics}
		*/
		this._physics = new Physics( this );
	}
	
	/**
	*	Adds a node to the graph and notifies the physics system
	*	@param {Node} tNode Node to add
	*	@return {bool} True if added
	*/
	setNode( tNode )
	{
		if ( super.setNode( tNode ) )
		{
			this._physics.onSetNode( tNode );
			
			return true;
		}
		
		return false;
	}
	
	/**
	*	Removes a node from the graph, removes it from selection, cleans up its links, and notifies the physics system
	*	@param {Node} tNode Node to remove
	*	@return {bool} True if removed
	*/
	removeNode( tNode )
	{
		if ( super.removeNode( tNode ) )
		{
			this._physics.onRemoveNode( tNode );

			return true;
		}
		
		return false;
	}
	
	/**
	*	Marks node as selected and notifies the physics system
	*	@param {Node} tNode Node to mark as selected
	*	@return {bool} True if set
	*/
	setSelectedNode( tNode )
	{
		if ( super.setSelectedNode( tNode ) )
		{
			this._physics.onSelectNode( tNode );
			
			return true;
		}
		
		return false;
	}
	
	/**
	*	Deselects a node and notifies the physics system
	*	@param {Node} tNode Node to unmark as selected
	*	@return {bool} True if unset
	*/
	removeSelectedNode( tNode )
	{
		if ( super.removeSelectedNode( tNode ) )
		{
			this._physics.onDeselectNode( tNode );

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