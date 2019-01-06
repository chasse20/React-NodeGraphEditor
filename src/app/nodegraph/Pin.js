import { observable, computed, decorate, set, values, has, remove, action } from "mobx";
import Vector2D from "../core/Vector2D";
import Matrix2D from "../core/Matrix2D";
import Edge from "./Edge";

export default class Pin
{
	constructor( tNode, tName, tLabel = "", tIsOut = true, tEdgeTypes = null, tOffset = new Vector2D() ) // TODO: Fix edgetypes!
	{
		this._node = tNode;
		this._name = tName;
		this._label = tLabel;
		this._isOut = tIsOut;
		this._edgeTypes = tEdgeTypes;
		this._offset = tOffset;
		this._links = {};
	}
	
	toJSON()
	{
		var tempJSON = null;
		
		// Label
		if ( this._label !== "" )
		{
			tempJSON =
			{
				label: this._label
			};
		}
		
		// Offset
		if ( !Vector2D.IsZero( this._offset ) )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.offset = this._offset;
		}

		// Links
		if ( this._isOut )
		{
			const tempLinks = values( this._links );
			if ( tempLinks.length > 0 )
			{
				if ( tempJSON === null )
				{
					tempJSON = {};
				}
				tempJSON.links = tempLinks;
			}
		}
		
		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			// Label
			if ( tJSON.label !== undefined )
			{
				this.label = tJSON.label;
			}

			// Offset
			if ( tJSON.offset !== undefined )
			{
				if ( tJSON.offset.x !== undefined )
				{
					this._offset.x = tJSON.offset.x;
				}
				
				if ( tJSON.offset.y !== undefined )
				{
					this._offset.y = tJSON.offset.y;
				}
			}
		}
	}
	
	fromJSONPost( tJSON, tNodeLoadRefs, tEdgeTypes, tDefaultEdgeType )
	{
		if ( this._isOut && tJSON != null && tJSON.links !== undefined && tNodeLoadRefs != null )
		{
			for ( let i = ( tJSON.links.length - 1 ); i >= 0; --i )
			{
				this.setLink( Edge.CreateFromJSON( tJSON.links[i], this, tNodeLoadRefs, tEdgeTypes, tDefaultEdgeType ) );
			}
		}
	}
	
	setLink( tEdge, tIsFromOther = false )
	{
		if ( tIsFromOther
			|| ( tEdge != null
			&& ( ( this._isOut && this === tEdge._source ) || ( !this._isOut && this === tEdge._target ) )
			&& ( tEdge._target._edgeTypes == null || ( tEdge._source._edgeTypes != null && tEdge._target._edgeTypes[ tEdge._source._edgeTypes._name ] ) ) ) )
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

	get key()
	{
		return this._node._id + this._name;
	}
	
	get localPosition()
	{
		return Vector2D.Add( this._node._transform._position, this._offset );
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
}

decorate( Pin,
	{
		label: observable,
		_offset: observable,
		_links: observable.shallow,
		fromJSON: action,
		setLink: action,
		removeLink: action,
		localPosition: computed
	}
);