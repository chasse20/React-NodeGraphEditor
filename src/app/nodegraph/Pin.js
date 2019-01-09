import { observable, computed, decorate, set, values, has, remove, action } from "mobx";
import Vector2D from "../core/Vector2D";
import Edge from "./Edge";

export default class Pin
{
	constructor( tNode, tIsOut = true, tEdgeTypes = null, tOffset = new Vector2D() )
	{
		this._node = tNode;
		this._isOut = tIsOut;
		this._edgeTypes = tEdgeTypes;
		this._offset = tOffset;
		this._links = {};
	}

	setLink( tEdge, tIsFromOther = false )
	{
		if ( tIsFromOther
			|| ( tEdge != null
			&& ( ( this._isOut && this === tEdge._source ) || ( !this._isOut && this === tEdge._target ) ) // must be proper source or proper target
			&& ( tEdge._target._edgeTypes == null || ( tEdge._source._edgeTypes != null && tEdge._target._edgeTypes[ tEdge._source._edgeTypes._name ] ) ) ) ) // edgetype of source must be allowed edgetypes of target
		{
			const tempKey = tEdge.key;
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
	
	removeLink( tEdge )
	{
		if ( tEdge != null )
		{
			const tempKey = tEdge.key;
			if ( has( this._links, tempKey ) )
			{
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
	
	removeEdgeType( tType )
	{
		if ( this._isOut && tType != null && ( this._edgeTypes == null || this._edgeTypes === tType ) )
		{
			const tempLinks = values( this._links );
			for ( let i = ( tempLinks.length - 1 ); i >= 0; --i )
			{
				let tempLink = tempLinks[i];
				if ( tempLink._type === tType )
				{
					this.removeLink( tempLink );
				}
			}
		}
	}

	get key()
	{
		var tempName = null;
		for ( let tempKey in this._node._pins )
		{
			if ( this._node._pins[ tempKey ] === this )
			{
				tempName = tempKey;
				break;
			}
		}
		
		return this._node._id + tempName;
	}
	
	get position()
	{
		return Vector2D.Add( this._node._position, this._offset );
	}
}

decorate( Pin,
	{
		_offset: observable,
		_links: observable.shallow,
		setLink: action,
		removeLink: action,
		removeEdgeType: action,
		position: computed
	}
);