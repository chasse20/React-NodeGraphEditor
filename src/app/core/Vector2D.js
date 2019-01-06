export default class Vector2D
{
	constructor( tX = 0, tY = 0 )
	{
		this.x = tX;
		this.y = tY;
	}

	toJSON()
	{
		return {
			x: this.x,
			y: this.y
		};
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null )
		{
			if ( tJSON.x !== undefined )
			{
				this.x = tJSON.x;
			}
			
			if ( tJSON.y !== undefined )
			{
				this.y = tJSON.y;
			}
		}
	}
	
	equals( tVector )
	{
		return this.x === tVector.x && this.y === tVector.y;
	}
	
	copy()
	{
		return new Vector2D( this.x, this.y );
	}
	
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
	
	get length()
	{
		return Math.sqrt( this.x * this.x + this.y * this.y );
	}
	
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
	
	get lengthSquared()
	{
		return this.x * this.x + this.y * this.y;
	}
	
	add( tVector )
	{
		this.x += tVector.x;
		this.y += tVector.y;
		
		return this;
	}
	
	subtract( tVector )
	{
		this.x -= tVector.x;
		this.y -= tVector.y;
		
		return this;
	}
	
	scale( tNumber )
	{
		this.x *= tNumber;
		this.y *= tNumber;
		
		return this;
	}

	static IsZero( tVector )
	{
		return tVector.x === 0 && tVector.y === 0;
	}

	static IsOne( tVector )
	{
		return tVector.x === 1 && tVector.y === 1;
	}
	
	static Equals( tA, tB )
	{
		return tA.x === tB.x && tA.y === tB.y;
	}

	static Add( tA, tB )
	{
		return new Vector2D( tA.x + tB.x, tA.y + tB.y );
	}

	static Subtract( tA, tB )
	{
		return new Vector2D( tA.x - tB.x, tA.y - tB.y );
	}
	
	static Scale( tVector, tNumber )
	{
		return new Vector2D( tVector.x * tNumber, tVector.y * tNumber );
	}
	
	static Dot( tA, tB )
	{
		return ( tA.x * tB.x ) + ( tA.y * tB.y );
	}
	
	static Cross( tA, tB )
	{
		return ( tA.x * tB.y ) - ( tA.y * tB.x );
	}
}