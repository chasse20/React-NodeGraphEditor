/**
*	Utility class for simple point-to-bounds collision checking
*/
export default class Bounds
{
	/**
	*	Constructor
	*	@param {number} tCenterX Center x-coordinate of the bounding box
	*	@param {number} tCenterY Center y-coordinate of the bounding box
	*	@param {number} tWidth Width of bounding box
	*	@param {number} tHeight Height of bounding box
	*/
	constructor( tCenterX, tCenterY, tWidth, tHeight )
	{
		const tempHalfWidth = tWidth * 0.5;
		const tempHalfHeight = tHeight * 0.5;
		
		/**
		*	Left extents
		*	@type {number}
		*/
		this.minX = tCenterX - tempHalfWidth;
		/**
		*	Top extents
		*	@type {number}
		*/
		this.minY = tCenterY - tempHalfHeight;
		/**
		*	Right extents
		*	@type {number}
		*/
		this.maxX = tCenterX + tempHalfWidth;
		/**
		*	Bottom extents
		*	@type {number}
		*/
		this.maxY = tCenterY + tempHalfHeight;
	}
	
	/**
	*	Creates a new bounding box from two opposite corners
	*	@param {Vector2D} tA Corner opposite to tB
	*	@param {Vector2D} tB Corner opposite to tA
	*	@return {Bounds} Bounds object
	*/
	static FromCorners( tA, tB )
	{
		var tempWidth = tB.x - tA.x;
		var tempStartX = tA.x;
		if ( tA.x > tB.x )
		{
			tempWidth *= -1;
			tempStartX = tB.x;
		}
		
		var tempHeight = tB.y - tA.y;
		var tempStartY = tA.y;
		if ( tA.y > tB.y )
		{
			tempHeight *= -1;
			tempStartY = tB.y;
		}
		
		return new Bounds( tempStartX + ( tempWidth * 0.5 ), tempStartY + ( tempHeight * 0.5 ), tempWidth, tempHeight );
	}
	
	/**
	*	Checks if a point is within the bounding box
	*	@param {Vector2D} tPoint Point to check
	*	@return {bool} True if tPoint is within the bounds
	*/
	contains( tPoint )
	{
		return tPoint.x >= this.minX && tPoint.x <= this.maxX && tPoint.y >= this.minY && tPoint.y <= this.maxY;
	}
}