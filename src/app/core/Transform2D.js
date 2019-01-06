import { observable, decorate, action, computed } from "mobx";
import Matrix2D from "./Matrix2D";
import Vector2D from "./Vector2D";
import { DEGREES_TO_RADIANS, RADIANS_TO_DEGREES } from "./Utility";

export default class Transform2D
{
	constructor( tPosition = new Vector2D(), tRotation = 0, tScale = new Vector2D( 1, 1 ) )
	{
		this._position = tPosition;
		this._rotation = tRotation;
		this._scale = tScale;
		this._parent = null;
		this._children = null;
		this._isLocalToWorldDirty = true;
		this._localToWorldMatrix = Matrix2D.Identity;
		this._isWorldToLocalDirty = true;
		this._worldToLocalMatrix = Matrix2D.Inverse( this._localToWorldMatrix );
	}
	
	toJSON()
	{
		var tempJSON = null;

		// Position
		if ( !Vector2D.IsZero( this._position ) )
		{
			tempJSON =
			{
				position: this._position
			};
		}

		// Rotation
		if ( this._rotation !== 0 )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.rotation = this._rotation;
		}

		// Scale
		if ( !Vector2D.IsOne( this._scale ) )
		{
			if ( tempJSON === null )
			{
				tempJSON = {};
			}
			tempJSON.scale = this._scale;
		}

		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			// Position
			if ( tJSON.position !== undefined )
			{
				if ( tJSON.position.x !== undefined )
				{
					this._position.x = tJSON.position.x;
				}
				
				if ( tJSON.position.y !== undefined )
				{
					this._position.y = tJSON.position.y;
				}
			}
			
			// Rotation
			if ( tJSON.rotation !== undefined )
			{
				this._rotation = tJSON.rotation;
			}
			
			// Scale
			if ( tJSON.scale !== undefined )
			{
				if ( tJSON.scale.x !== undefined )
				{
					this._scale.x = tJSON.scale.x;
				}
				
				if ( tJSON.scale.y !== undefined )
				{
					this._scale.y = tJSON.scale.y;
				}
			}
		}
	}
	
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
	
	set position( tVector )
	{
		this._position = tVector;
		this.markDirty();
	}

	set rotation( tAngle )
	{
		this._rotation = tAngle;
		this.markDirty();
	}

	set scale( tVector )
	{
		this._scale = tVector;
		this.markDirty();
	}
	
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

	get localMatrix()
	{
		return Matrix2D.TRS( this._position, this._rotation * DEGREES_TO_RADIANS, this._scale );
	}

	get localToWorldMatrix()
	{
		if ( this._isLocalToWorldDirty )
		{
			if ( this._parent != null )
			{
				this._localToWorldMatrix = Matrix2D.Multiply( this._parent.localToWorldMatrix, this.localMatrix );
			}

			this._isLocalToWorldDirty = false;
		}

		return this._localToWorldMatrix;
	}

	get worldToLocalMatrix()
	{
		if ( this._isWorldToLocalDirty )
		{
			this._worldToLocalMatrix = Matrix2D.Inverse( this.localToWorldMatrix );
			this._isWorldToLocalDirty = false;
		}

		return this._worldToLocalMatrix;
	}

	get worldPosition()
	{
		return this._parent == null ? this._position : Matrix2D.MultiplyPoint( this._parent.localToWorldMatrix, this._position );
	}

	set worldPosition( tVector )
	{
		this.position = this._parent == null ? tVector : Matrix2D.MultiplyPoint( this._parent.worldToLocalMatrix, tVector );
	}
	
	get worldRotation() // gets euler angles
	{
		return this._parent == null ? this._rotation : Matrix2D.DecomposeRotation( this.localToWorldMatrix ) * RADIANS_TO_DEGREES;
	}
	
	set worldRotation( tAngle ) // expects euler angle
	{
		this.rotation = this._parent == null ? tAngle : tAngle - this.worldRotation;
	}
	
	get worldScale() // this is not accurate if skewed
	{
		return this._parent == null ? this._scale : Matrix2D.DecomposeScale( this.localToWorldMatrix );
	}
	
	set worldScale( tVector ) // this is not accurate if skewed
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
		fromJSON: action,
		localMatrix: computed,
		localToWorldMatrix: computed,
		worldToLocalMatrix: computed,
		worldPosition: computed,
		worldRotation: computed,
		worldScale: computed
	}
);