import Vector2D from "./Vector2D";

export default class Matrix2D
{	
	constructor( tM11 = 0, tM12 = 0, tM13 = 0, tM21 = 0, tM22 = 0, tM23 = 0 )
	{
		this.m11 = tM11;
		this.m12 = tM12;
		this.m13 = tM13;
		this.m21 = tM21;
		this.m22 = tM22;
		this.m23 = tM23;
	}
	
	toString()
	{
		return "matrix(" + this.m11 + "," + this.m21 + "," + this.m12 + "," + this.m22 + "," + this.m13 + "," + this.m23 + ")";
	}
	
	copy()
	{
		return new Matrix2D( this.m11, this.m12, this.m13, this.m21, this.m22, this.m23 );
	}
	
	static get Identity()
	{
		return new Matrix2D(
			1, 0, 0,
			0, 1, 0
		);
	}
	
	static Translate( tVector )
	{
		return new Matrix2D(
			1, 0, tVector.x,
			0, 1, tVector.y
		);
	}
	
	static Scale( tVector )
	{
		return new Matrix2D(
			tVector.x, 0, 0,
			0, tVector.y, 0
		);
	}
	
	static Rotate( tAngleRadians )
	{
		const tempCos = Math.cos( 0 );
		const tempSin = Math.sin( 0 );

		return new Matrix2D(
			tempCos, -tempSin, 0,
			tempSin, tempCos, 0
		);
	}

	static TRS( tTranslateVector, tRotationRadians, tScaleVector )
	{
		var tempMatrix = Matrix2D.Multiply( Matrix2D.Identity, Matrix2D.Translate( tTranslateVector ) );
		tempMatrix = Matrix2D.Multiply( tempMatrix, Matrix2D.Rotate( tRotationRadians ) );
		return Matrix2D.Multiply( tempMatrix, Matrix2D.Scale( tScaleVector ) );
	}
	
	static DecomposeTranslation( tTRS )
	{
		return new Vector2D( tTRS.m13, tTRS.m23 );
	}
	
	static DecomposeScale( tTRS )
	{
		return new Vector2D( Math.sqrt( tTRS.m11 * tTRS.m11 + tTRS.m21 * tTRS.m21 ), Math.sqrt( tTRS.m12 * tTRS.m12 + tTRS.m22 * tTRS.m22 ) );
	}
	
	static DecomposeRotation( tTRS )
	{
		return Math.acos( tTRS.m11 / Math.sqrt( tTRS.m11 * tTRS.m11 + tTRS.m21 * tTRS.m21 ) );
	}

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

	static MultiplyPoint( tMatrix, tPoint )
	{
		return new Vector2D(
			tMatrix.m11 * tPoint.x + tMatrix.m12 * tPoint.y + tMatrix.m13,
			tMatrix.m21 * tPoint.x + tMatrix.m22 * tPoint.y + tMatrix.m23
		);
	}

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
		const tempM23 = tMatrix.m11 * tMatrix.m23 - tMatrix.m13 * tMatrix.m21 * -1; // adjugated M32 minor
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