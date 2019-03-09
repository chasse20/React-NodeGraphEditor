import { observable, decorate, computed } from "mobx";
import Matrix2D from "./Matrix2D";
import Vector2D from "./Vector2D";
import { DEGREES_TO_RADIANS, RADIANS_TO_DEGREES } from "./Utility";

/**
*	Represents a 2D. hierarchical, decomposed matrix with position, rotation and scale properties
*	@memberof core
*	@param {Vector2D} [tPosition] Local position of the transform
*	@param {Vector2D} [tRotation=0] Local rotation euler angle
*	@param {Vector2D} [tScale] Local scale of the transform
*/
export default class Transform2D
{
	constructor( tPosition = new Vector2D( 0, 0, 0 ), tRotation = 0, tScale = new Vector2D( 1, 1 ) )
	{
		/**
		*	Local position
		*	@type {Vector2D}
		*/
		this._position = tPosition;
		/**
		*	Local rotation euler angle
		*	@type {number}
		*/
		this._rotation = tRotation;
		/**
		*	Local Scale
		*	@type {Vector2D}
		*/
		this._scale = tScale;
		/**
		*	Parent transform that the transform's matrix gets multiplied into
		*	@type {Transform2D}
		*/
		this._parent = null;
		/**
		*	Child transforms
		*	@type {Transform2D[]}
		*/
		this._children = null;
		/**
		*	Flag that, when set, ensures the local-to-world matrix is updated
		*	@type {Transform2D}
		*/
		this._isLocalToWorldDirty = true;
		/**
		*	Matrix used to transform points from local space to world space
		*	@type {Transform2D}
		*/
		this._localToWorldMatrix = Matrix2D.Identity;
		/**
		*	Flag that, when set, ensures the world-to-local matrix is updated
		*	@type {Transform2D}
		*/
		this._isWorldToLocalDirty = true;
		/**
		*	Matrix used to transform points from world space to local space
		*	@type {Transform2D}
		*/
		this._worldToLocalMatrix = Matrix2D.Inverse( this._localToWorldMatrix );
	}
	
	/**
	*	Sets the parent transform and removes itself from the previous parent
	*	@param {Transform2D} tParent Parent transform
	*/
	set parent( tParent )
	{
		if ( tParent !== this._parent )
		{
			if ( this._parent != null )
			{
				this._parent.removeChild( this );
			}
			
			this._parent = tParent;
			
			if ( this._parent != null )
			{
				this._parent.addChild( this );
			}
			
			this.markDirty();
		}
	}
	
	/**
	*	Adds a child transform
	*	@param {Transform2D} tChild Child transform
	*	@return {bool} True if successfully added
	*/
	addChild( tChild )
	{
		if ( tChild != null )
		{
			if ( this._children === null )
			{
				this._children = [];
				this._children.push( tChild );
				tChild.parent = this;
				
				return true;
			}
			else if ( this._children.indexOf( tChild ) < 0 )
			{
				this._children.push( tChild );
				tChild.parent = this;
				
				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Removes a child transform
	*	@param {Transform2D} tChild Child transform
	*	@return {bool} True if successfully removed
	*/
	removeChild( tChild )
	{
		if ( tChild != null && this._children !== null )
		{		
			const tempIndex = this._children.indexOf( tChild );
			if ( tempIndex >= 0 )
			{
				const tempChild = this._children[ tempIndex ];
				
				this._children.splice( tempIndex, 1 );
				if ( this._children.length === 0 )
				{
					this._children = null;
				}
				
				tempChild.parent = null;
				
				return true;
			}
		}
		
		return false;
	}
	
	/**
	*	Gets the local position
	*	@return {Vector2D} Position
	*/
	get position()
	{
		return this._position;
	}
	
	/**
	*	Sets the local position and flags this transform as dirty
	*	@param {Vector2D} tVector Position vector
	*/
	set position( tVector )
	{
		this._position = tVector;
		this.markDirty();
	}
	
	/**
	*	Gets the local rotation
	*	@return {number} Euler angle
	*/
	get rotation()
	{
		return this._rotation;
	}

	/**
	*	Sets the local rotation with a euler angle and flags this transform as dirty
	*	@param {number} tAngle Euler angle
	*/
	set rotation( tAngle )
	{
		this._rotation = tAngle;
		this.markDirty();
	}
	
	/**
	*	Gets the local scale
	*	@return {Vector2D} Scale
	*/
	get scale()
	{
		return this._scale;
	}

	/**
	*	Sets the local scale and flags this transform as dirty
	*	@param {Vector2D} tVector Scale vector
	*/
	set scale( tVector )
	{
		this._scale = tVector;
		this.markDirty();
	}
	
	/**
	*	Flags this transform and its children as dirty, forcing a TRS rebuild when the world or local matrices are called
	*/
	markDirty()
	{
		this._isLocalToWorldDirty = true;
		this._isWorldToLocalDirty = true;
		
		if ( this._children != null )
		{
			for ( let i = ( this._children.length - 1 ); i >= 0; --i )
			{
				this._children[i].markDirty();
			}
		}
	}

	/**
	*	Builds a matrix from the local position, rotation and scale properties of this transform
	*	@return {Matrix2D} Composed matrix
	*/
	get localMatrix()
	{
		return Matrix2D.TRS( this._position, this._rotation * DEGREES_TO_RADIANS, this._scale );
	}

	/**
	*	Returns the local-to-world matrix of this transform, will rebuild if marked as dirty
	*	@return {Matrix2D} Local-to-world matrix
	*/
	get localToWorldMatrix()
	{
		if ( this._isLocalToWorldDirty )
		{
			this._localToWorldMatrix = this.localMatrix;
			if ( this._parent != null )
			{
				this._localToWorldMatrix = Matrix2D.Multiply( this._parent.localToWorldMatrix, this._localToWorldMatrix );
			}

			this._isLocalToWorldDirty = false;
		}

		return this._localToWorldMatrix;
	}

	/**
	*	Returns the world-to-local matrix of this transform,will rebuild if marked as dirty
	*	@return {Matrix2D} World-to-local matrix
	*/
	get worldToLocalMatrix()
	{
		if ( this._isWorldToLocalDirty )
		{
			this._worldToLocalMatrix = Matrix2D.Inverse( this.localToWorldMatrix );
			this._isWorldToLocalDirty = false;
		}

		return this._worldToLocalMatrix;
	}

	/**
	*	Gets the world position
	*	@return {Vector2D} Position
	*/
	get worldPosition()
	{
		return Matrix2D.DecomposeTranslation( this.localToWorldMatrix );
	}

	/**
	*	Sets the world position
	*	@param {Vector2D} tVector Position vector
	*/
	set worldPosition( tVector )
	{
		this.position = this._parent == null ? tVector : Matrix2D.MultiplyPoint( this._parent.worldToLocalMatrix, tVector );
	}
	
	/**
	*	Gets the world rotation
	*	@return {number} Euler angle
	*/
	get worldRotation()
	{
		return this._parent == null ? this._rotation : Matrix2D.DecomposeRotation( this.localToWorldMatrix ) * RADIANS_TO_DEGREES;
	}
	
	/**
	*	Sets the world rotation with a euler angle
	*	@param {number} tAngle Euler angle
	*/
	set worldRotation( tAngle )
	{
		this.rotation = this._parent == null ? tAngle : tAngle - this.worldRotation;
	}
	
	/**
	*	Gets the lossy world scale
	*	@return {Vector2D} Scale
	*/
	get worldScale()
	{
		return this._parent == null ? this._scale : Matrix2D.DecomposeScale( this.localToWorldMatrix );
	}
	
	/**
	*	Attempts to set world scale which will be lossy if skewed
	*	@param {Vector2D} tVector Scale vector
	*/
	set worldScale( tVector )
	{
		if ( this._parent == null )
		{
			this.scale = tVector;
		}
		else
		{
			const tempWorldScale = this.worldScale;
			this._scale.x *= tVector.x / tempWorldScale.x;
			this._scale.y *= tVector.y / tempWorldScale.y;
			this.scale = this._scale;
		}
	}
}

decorate( Transform2D,
	{
		_position: observable,
		_rotation: observable,
		_scale: observable,
		position: computed,
		rotation: computed,
		scale: computed,
		localToWorldMatrix: computed,
		worldToLocalMatrix: computed,
		worldPosition: computed,
		worldRotation: computed,
		worldScale: computed
	}
);