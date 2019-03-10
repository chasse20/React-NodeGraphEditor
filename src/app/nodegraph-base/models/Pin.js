import { observable, computed, decorate, set, remove, has, get, values, action } from "mobx";
import Vector2D from "../../core/Vector2D";

/**
*	Pin model that manages all edge links
*	@memberof nodegraph-base
*	@param {string} tName Key name of the pin used for lookups in its owning node
*	@param {Node} tNode Node instance that this pin is coupled to
*	@param {bool} [tIsOut=true] Direction of this pin
*	@param {Object,TypeEdge} [tEdgeTypes=null] Allowed edge types that get checked for compatability when creating links with other pins. Null can connect to null. If target pin types set to null, anything can connect.
*	@param {core.Vector2D} [tOffset] Relative offset position from the pin's node
*/
export default class Pin
{
	constructor( tName, tNode, tIsOut = true, tEdgeTypes = null, tOffset = new Vector2D() )
	{
		/**
		*	Key name of the pin used for lookups in its owning node
		*	@type {string}
		*/
		this._name = tName;
		/**
		*	Node instance that this pin is coupled to
		*	@type {Node}
		*/
		this._node = tNode;
		/**
		*	Direction of this pin
		*	@type {bool}
		*/
		this._isOut = tIsOut;
		/**
		*	 Allowed edge types that get checked for compatability when creating links with other pins. Null can connect to null. If target pin types set to null, anything can connect.
		*	@type {Object,TypeEdge}
		*/
		this._edgeTypes = tEdgeTypes;
		/**
		*	Relative offset position from the pin's node
		*	@type {core.Vector2D}
		*/
		this.offset = tOffset;
		/**
		*	Associative array of edge models
		*	@type {Object}
		*/
		this._links = {};
	}

	/**
	*	Adds an edge link to the pin
	*	@param {Edge} tEdge Edge link to add
	*	@param {bool} [tIsFromOther=false] Optimization flag that gets set when coming from another pin's linking method
	*	@return {bool} True if added
	*/
	setLink( tEdge, tIsFromOther = false )
	{
		if ( tIsFromOther
			|| ( tEdge != null
			&& ( ( this._isOut && this === tEdge._source ) || ( !this._isOut && this === tEdge._target ) ) // must be proper source or proper target
			&& ( tEdge._target._edgeTypes == null || ( tEdge._source._edgeTypes != null && tEdge._target._edgeTypes[ tEdge._source._edgeTypes._name ] ) ) ) ) // edgetype of source must be allowed edgetypes of target
		{
			const tempKey = tEdge.id;
			if ( !has( this._links, tempKey ) )
			{
				set( this._links, tempKey, tEdge );

				if ( !tIsFromOther )
				{
					if ( this._isOut )
					{
						tEdge._target.setLink( tEdge, true );
					}
					else
					{
						tEdge._source.setLink( tEdge, true );
					}
				}

				return true;
			}
		}

		return false;
	}
	
	/**
	*	Removes an edge link from the pin and ensures its deselected from the graph
	*	@param {Edge} tEdge Edge link to remove
	*	@return {bool} True if removed
	*/
	removeLink( tEdge )
	{
		if ( tEdge != null )
		{
			const tempKey = tEdge.id;
			if ( tEdge === get( this._links, tempKey ) )
			{
				this._node._graph.removeSelectedEdge( tEdge );
				remove( this._links, tempKey );
				
				if ( this._isOut )
				{
					tEdge._target.removeLink( tEdge );
				}
				else
				{
					tEdge._source.removeLink( tEdge );
				}

				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Clears all links
	*/
	clearLinks()
	{
		const tempLinks = values( this._links );
		for ( let i = ( tempLinks.length - 1 ); i >= 0; --i )
		{
			this.removeLink( tempLinks[i] );
		}
	}
	
	/**
	*	Remove all edge links belonging to type
	*	@param {TypeEdge} tType Edge type
	*/
	removeEdgesOfType( tType )
	{
		if ( this._isOut && tType != null && ( this._edgeTypes == null || this._edgeTypes === tType ) )
		{
			const tempLinks = values( this._links );
			for ( let i = ( tempLinks.length - 1 ); i >= 0; --i )
			{
				if ( tempLinks[i]._type === tType )
				{
					this.removeLink( tempLinks[i] );
				}
			}
		}
	}
	
	/**
	*	Returns a unique string ID of the edge (node ID + name)
	*	@return {string} Unique ID
	*/
	get id()
	{
		return this._node._id + this._name;
	}
	
	/**
	*	Returns the graph position of this node by adding its offset to the owning nodes' position
	*	@return {core.Vector2D} Graph position of this node
	*/
	get position()
	{
		return Vector2D.Add( this._node.position, this.offset );
	}
}

decorate( Pin,
	{
		offset: observable,
		_links: observable.shallow,
		setLink: action,
		removeLink: action,
		removeEdgeType: action,
		position: computed
	}
);