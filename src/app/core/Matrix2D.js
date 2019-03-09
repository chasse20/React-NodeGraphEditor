import Vector2D from "./Vector2D";

/**
*	2D Matrix
*	@memberof core
*	@param {number} [tM11=0] M11
*	@param {number} [tM12=0] M12
*	@param {number} [tM13=0] M13
*	@param {number} [tM21=0] M21
*	@param {number} [tM22=0] M22
*	@param {number} [tM23=0] M23
*/
export default class Matrix2D
{
	constructor( tM11 = 0, tM12 = 0, tM13 = 0, tM21 = 0, tM22 = 0, tM23 = 0 )
	{
		/**
		*	M11
		*	@type {number}
		*/
		this.m11 = tM11;
		/**
		*	M12
		*	@type {number}
		*/
		this.m12 = tM12;
		/**
		*	M13
		*	@type {number}
		*/
		this.m13 = tM13;
		/**
		*	M21
		*	@type {number}
		*/
		this.m21 = tM21;
		/**
		*	M22
		*	@type {number}
		*/
		this.m22 = tM22;
		/**
		*	M23
		*	@type {number}
		*/
		this.m23 = tM23;
	}
	
	/**
	*	Returns the CSS string representation
	*	@return {string} CSS transform string of this matrix
	*/
	toString()
	{
		return "matrix(" + this.m11 + "," + this.m21 + "," + this.m12 + "," + this.m22 + "," + this.m13 + "," + this.m23 + ")";
	}
	
	/**
	*	Creates a hard copy of this matrix
	*	@return {Matrix2D} Copy of this matrix
	*/
	copy()
	{
		return new Matrix2D( this.m11, this.m12, this.m13, this.m21, this.m22, this.m23 );
	}
	
	/**
	*	Creates an identity matrix
	*	@return {Matrix2D} Identity matrix
	*/
	static get Identity()
	{
		return new Matrix2D(
			1, 0, 0,
			0, 1, 0
		);
	}
	
	/**
	*	Creates a translation matrix from a point
	*	@param {Vector2D} tVector Point
	*	@return {Matrix2D} Translation matrix
	*/
	static Translate( tVector )
	{
		return new Matrix2D(
			1, 0, tVector.x,
			0, 1, tVector.y
		);
	}
	
	/**
	*	Creates a scale matrix from a scale vector
	*	@param {Vector2D} tVector Scale
	*	@return {Matrix2D} Scale matrix
	*/
	static Scale( tVector )
	{
		return new Matrix2D(
			tVector.x, 0, 0,
			0, tVector.y, 0
		);
	}
	
	/**
	*	Creates a rotation matrix from a radian angle
	*	@param {number} tAngleRadians Angle in radians
	*	@return {Matrix2D} Rotation matrix
	*/
	static Rotate( tAngleRadians )
	{
		const tempCos = Math.cos( 0 );
		const tempSin = Math.sin( 0 );

		return new Matrix2D(
			tempCos, -tempSin, 0,
			tempSin, tempCos, 0
		);
	}

	/**
	*	Composes a TRS matrix from a point, angle and scale vector
	*	@param {Vector2D} tTranslateVector Point
	*	@param {number} tRotationRadians Angle in radians
	*	@param {Vector2D} tScaleVector Scale
	*	@return {Matrix2D} TRS matrix
	*/
	static TRS( tTranslateVector, tRotationRadians, tScaleVector )
	{
		var tempMatrix = Matrix2D.Multiply( Matrix2D.Identity, Matrix2D.Translate( tTranslateVector ) );
		tempMatrix = Matrix2D.Multiply( tempMatrix, Matrix2D.Rotate( tRotationRadians ) );
		return Matrix2D.Multiply( tempMatrix, Matrix2D.Scale( tScaleVector ) );
	}
	
	/**
	*	Decomposes a translation vector from a TRS matrix
	*	@param {Matrix2D} tTRS Matrix to decompose
	*	@return {Vector2D} Translation vector
	*/
	static DecomposeTranslation( tTRS )
	{
		return new Vector2D( tTRS.m13, tTRS.m23 );
	}
	
	/**
	*	Decomposes a lossy scale vector from a TRS matrix
	*	@param {Matrix2D} tTRS Matrix to decompose
	*	@return {Vector2D} Scale vector
	*/
	static DecomposeScale( tTRS )
	{
		return new Vector2D( Math.sqrt( tTRS.m11 * tTRS.m11 + tTRS.m21 * tTRS.m21 ), Math.sqrt( tTRS.m12 * tTRS.m12 + tTRS.m22 * tTRS.m22 ) );
	}
	
	/**
	*	Decomposes the rotation angle from a matrix
	*	@param {Matrix2D} tTRS Matrix to decompose
	*	@return {number} Rotation angle in radians
	*/
	static DecomposeRotation( tTRS )
	{
		return Math.acos( tTRS.m11 / Math.sqrt( tTRS.m11 * tTRS.m11 + tTRS.m21 * tTRS.m21 ) );
	}

	/**
	*	Multiplies two matrices together
	*	@param {Matrix2D} tA
	*	@param {Matrix2D} tB
	*	@return {Matrix2D} Multiplied result
	*/
	static Multiply( tA, tB )
	{
		// Row 1
		const tempM11 = tA.m11 * tB.m11 + tA.m12 * tB.m21;
		const tempM12 = tA.m11 * tB.m12 + tA.m12 * tB.m22;
		const tempM13 = tA.m11 * tB.m13 + tA.m12 * tB.m23 + tA.m13;
		
		// Row 2
		const tempM21 = tA.m21 * tB.m11 + tA.m22 * tB.m21;
		const tempM22 = tA.m21 * tB.m12 + tA.m22 * tB.m22;
		const tempM23 = tA.m21 * tB.m13 + tA.m22 * tB.m23 + tA.m23;
		
		return new Matrix2D( tempM11, tempM12, tempM13, tempM21, tempM22, tempM23 );
	}

	/**
	*	Transforms a vector by a matrix
	*	@param {tMatrix} tMatrix Matrix to transform tPoint by
	*	@param {Vector2D} tPoint Vector to apply the transformation to
	*	@return {Vector2D} Transformed vector
	*/
	static MultiplyPoint( tMatrix, tPoint )
	{
		return new Vector2D(
			tMatrix.m11 * tPoint.x + tMatrix.m12 * tPoint.y + tMatrix.m13,
			tMatrix.m21 * tPoint.x + tMatrix.m22 * tPoint.y + tMatrix.m23
		);
	}

	/**
	*	Inverses a matrix
	*	@param {Matrix2D} tMatrix Matrix to inverse
	*	@return {Matrix2D} Inversed matrix
	*/
	static Inverse( tMatrix )
	{
		// Determinant
		let tempDeterminant = tMatrix.m11 * tMatrix.m22 - tMatrix.m12 * tMatrix.m21;
		if ( tempDeterminant === 0 )
		{
			return new Matrix2D();
		}

		// Minors
		const tempM11 = tMatrix.m22;
		const tempM12 = tMatrix.m12 * -1; // cofactor, adjugated M21 minor
		const tempM13 = tMatrix.m12 * tMatrix.m23 - tMatrix.m13 * tMatrix.m22; // adjugated M31 minor
		const tempM21 = tMatrix.m21 * -1; // cofactor, adjugated M12 minor
		const tempM22 = tMatrix.m11;
		const tempM23 = ( tMatrix.m11 * tMatrix.m23 - tMatrix.m13 * tMatrix.m21 ) * -1; // cofactor, adjugated M32 minor
		const tempM33 = tMatrix.m11 * tMatrix.m22 - tMatrix.m12 * tMatrix.m21;

		// Multiply by 1/determinant and return inverse
		tempDeterminant = 1 / tempDeterminant;
		
		return new Matrix2D(
			tempM11 * tempDeterminant, tempM12 * tempDeterminant, tempM13 * tempDeterminant,
			tempM21 * tempDeterminant, tempM22 * tempDeterminant, tempM23 * tempDeterminant,
			tempM13 * tempDeterminant, tempM23 * tempDeterminant, tempM33 * tempDeterminant
		);
	}
}