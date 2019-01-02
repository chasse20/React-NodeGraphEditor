import Vector2D from "../core/Vector2D";
import Matrix2D from "../core/Matrix2D";

export default class Selection
{
	constructor( tTransform )
	{
		this._viewTransform = tTransform;
		this._mouseStart = new Vector2D();
		this._viewOffset = new Vector2D();
		this._selectedNodes = null;
		this._selectedNodeStarts = null;
		this._isSelectedNodes = false;
		this.isPanMode = false;
	}
	
	selectSingleNode( tSelected )
	{
		this.clearSelectedNodes();
		this.addSelectedNode( tSelected );
	}

	addSelectedNode( tSelected )
	{
		if ( !this.isPanMode && tSelected != null )
		{
			if ( !this._isSelectedNodes )
			{
				this._selectedNodes = [];
				this._selectedNodeStarts = [];
				this._isSelectedNodes = true;
			}
			
			this._selectedNodes.push( tSelected );
			
			return true;
		}
		
		return false;
	}
	
	removeSelected( tSelected )
	{
		if ( !this.isPanMode && tSelected != null && this._isSelectedNodes )
		{
			const tempIndex = this._selectedNodes.indexOf( tSelected );
			if ( tempIndex >= 0 )
			{
				this._selectedNodes.splice( tempIndex, 1 );
				if ( this._selectedNodes.length === 0 )
				{
					this._selectedNodes = null;
					this._selectedNodeStarts = null;
					this._isSelectedNodes = false;
				}
				
				return true;
			}
		}
		
		return false;
	}
	
	removeSelectedAtIndex( tIndex )
	{
		if ( this._isSelectedNodes && tIndex >= 0 && tIndex < this._selectedNodes.length )
		{
			this._selectedNodes.splice( tIndex, 1 );
			if ( this._selectedNodes.length === 0 )
			{
				this._selectedNodes = null;
				this._selectedNodeStarts = null;
				this._isSelectedNodes = false;
			}
			
			return true;
		}
		
		return false;
	}

	clearSelectedNodes()
	{
		if ( this._isSelectedNodes )
		{
			this._selectedNodes = null;
			this._selectedNodeStarts = null;
			this._isSelectedNodes = false;
		}
	}
	
	startMove( tScreenPoint )
	{
		this._viewOffset = Matrix2D.MultiplyPoint( this._viewTransform.localToWorldMatrix, tScreenPoint ).subtract( this._viewTransform.worldPosition );
		
		if ( this._isSelectedNodes )
		{
			this._mouseStart = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this._viewTransform.localMatrix ), tScreenPoint );
			this._selectedNodeStarts = [];
			const tempListLength = this._selectedNodes.length;
			for ( let i = 0; i < tempListLength; ++i )
			{
				this._selectedNodeStarts.push( this._selectedNodes[i]._transform.worldPosition );
			}
		}
	}
	
	tryMove( tScreenPoint )
	{
		if ( this.isPanMode )
		{
			this._viewTransform.worldPosition = Matrix2D.MultiplyPoint( this._viewTransform.localToWorldMatrix, tScreenPoint ).subtract( this._viewOffset );
		}
		else if ( this._isSelectedNodes )
		{
			const tempMouseOffset = Matrix2D.MultiplyPoint( Matrix2D.Inverse( this._viewTransform.localMatrix ), tScreenPoint ).subtract( this._mouseStart );
			for ( let i = ( this._selectedNodes.length - 1 ); i >= 0; --i )
			{
				this._selectedNodes[i]._transform.worldPosition = Vector2D.Add( tempMouseOffset, this._selectedNodeStarts[i] );
			}
		}
	}
}