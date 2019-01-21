import { observable, computed, decorate, set, remove, action } from "mobx";
import Vector2D from "../../core/Vector2D";

export default class Pin
{
	constructor( tNode, tIsOut = true, tEdgeTypes = null, tOffset = new Vector2D() )
	{
		this._node = tNode;
		this._isOut = tIsOut;
		this._edgeTypes = tEdgeTypes;
		this.offset = tOffset;
		this._links = {};
	}

	setLink( tEdge, tIsFromOther = false )
	{
		if ( tIsFromOther
			|| ( tEdge != null
			&& ( ( this._isOut && this === tEdge._source ) || ( !this._isOut && this === tEdge._target ) ) // must be proper source or proper target
			&& ( tEdge._target._edgeTypes == null || ( tEdge._source._edgeTypes != null && tEdge._target._edgeTypes[ tEdge._source._edgeTypes._name ] ) ) ) ) // edgetype of source must be allowed edgetypes of target
		{
			const tempKey = tEdge.id;
			if ( tEdge !== this._links[ tempKey ] )
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
			const tempKey = tEdge.id;
			if ( this._links[ tempKey ] !== undefined )
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
			for ( let tempKey in this._links )
			{
				let tempLink = this._links[ tempKey ];
				if ( tempLink._type === tType )
				{
					this.removeLink( tempLink );
				}
			}
		}
	}

	get id()
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