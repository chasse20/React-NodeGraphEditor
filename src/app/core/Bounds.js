export default class Bounds
{
	constructor( tX = 0, tY = 0, tWidth = 0, tHeight = 0)
	{
		this.x = tX;
		this.y = tY;
		this.width = tWidth;
		this.height = tHeight;
	}
	
	static FromCorners( tA, tB )
	{
		var tempX = tA.x;
		var tempY = tA.y;
		var tempWidth = tB.x - tA.x;
		var tempHeight = tB.y - tA.y;
		
		if ( tempX > tB.x )
		{
			tempX = tB.x;
			tempWidth *= -1;
		}
		
		if ( tempY > tB.y )
		{
			tempY = tB.y;
			tempHeight *= -1;
		}
		
		return new Bounds( tempX, tempY, tempWidth, tempHeight );
	}
	
	contains( tPoint )
	{
		return tPoint.x >= this.x && tPoint.x <= ( this.x + this.width ) && tPoint.y >= this.y && tPoint.y <= ( this.y + this.height );
	}
}