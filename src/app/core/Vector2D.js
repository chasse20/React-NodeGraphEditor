/**
*	2D Vector
*	@memberof core
*	@param {number} [tX=0] x
*	@param {number} [tY=0] y
*/
export default class Vector2D
{
	constructor( tX = 0, tY = 0 )
	{
		/**
		*	x
		*	@type {number}
		*/
		this.x = tX;
		/**
		*	y
		*	@type {number}
		*/
		this.y = tY;
	}
	
	/**
	*	Creates a hard copy of this vector
	*	@return {Vector2D} Copy of this vector
	*/
	copy()
	{
		return new Vector2D( this.x, this.y );
	}
	
	/**
	*	Normalizes this vector
	*	@return {Vector2D} This
	*/
	normalize()
	{
		const tempLength = this.length;
		if ( tempLength > 0 )
		{
			this.x /= tempLength;
			this.y /= tempLength;
		}
		
		return this;
	}
	
	/**
	*	Gets the length
	*	@return {number} Length
	*/
	get length()
	{
		return Math.sqrt( this.x * this.x + this.y * this.y );
	}
	
	/**
	*	Sets the length
	*	@param {number} tLength Length
	*/
	set length( tLength )
	{
		var tempLength = this.length;
		if ( tempLength > 0 )
		{
			tempLength = tLength / tempLength;
			this.x *= tempLength;
			this.y *= tempLength;
		}
	}
	
	/**
	*	Gets the length squared
	*	@return {number} Length squared
	*/
	get lengthSquared()
	{
		return this.x * this.x + this.y * this.y;
	}
	
	/**
	*	Adds another vector to this
	*	@param {Vector2D} Vector to add
	*	@return {Vector2D} This (used for method chaining)
	*/
	add( tVector )
	{
		this.x += tVector.x;
		this.y += tVector.y;
		
		return this;
	}
	
	/**
	*	Subtracts another vector from this
	*	@param {Vector2D} Vector to subtract
	*	@return {Vector2D} This (used for method chaining)
	*/
	subtract( tVector )
	{
		this.x -= tVector.x;
		this.y -= tVector.y;
		
		return this;
	}
	
	/**
	*	Scales this vector
	*	@param {number} Scalar
	*	@return {Vector2D} This (used for method chaining)
	*/
	scale( tNumber )
	{
		this.x *= tNumber;
		this.y *= tNumber;
		
		return this;
	}

	/**
	*	Checks if a vector is set to 0,0
	*	@param {tVector} Vector to check
	*	@return {bool} True if 0,0
	*/
	static IsZero( tVector )
	{
		return tVector.x === 0 && tVector.y === 0;
	}

	/**
	*	Checks if a vector is set to 1,1
	*	@param {tVector} Vector to check
	*	@return {bool} True if 1,1
	*/
	static IsOne( tVector )
	{
		return tVector.x === 1 && tVector.y === 1;
	}
	
	/**
	*	Checks if two vectors are equal
	*	@param {tVector} tA
	*	@param {tVector} tB
	*	@return {bool} True if equal
	*/
	static Equals( tA, tB )
	{
		return tA.x === tB.x && tA.y === tB.y;
	}

	/**
	*	Adds two vectors together
	*	@param {tVector} tA
	*	@param {tVector} tB
	*	@return {tVector} Added result
	*/
	static Add( tA, tB )
	{
		return new Vector2D( tA.x + tB.x, tA.y + tB.y );
	}

	/**
	*	Subtract a vector from another
	*	@param {tVector} tA
	*	@param {tVector} tB
	*	@return {tVector} Subtracted result
	*/
	static Subtract( tA, tB )
	{
		return new Vector2D( tA.x - tB.x, tA.y - tB.y );
	}
	
	/**
	*	Scale a vector by a number
	*	@param {tVector} tVector
	*	@param {number} tNumber
	*	@return {tVector} Scaled result
	*/
	static Scale( tVector, tNumber )
	{
		return new Vector2D( tVector.x * tNumber, tVector.y * tNumber );
	}
	
	/**
	*	Gets the dot product of two vectors
	*	@param {tVector} tA
	*	@param {tVector} tB
	*	@return {number} Dot product
	*/
	static Dot( tA, tB )
	{
		return ( tA.x * tB.x ) + ( tA.y * tB.y );
	}
	
	/**
	*	Gets the cross product of two vectors
	*	@param {tVector} tA
	*	@param {tVector} tB
	*	@return {number} Cross product
	*/
	static Cross( tA, tB )
	{
		return ( tA.x * tB.y ) - ( tA.y * tB.x );
	}
}