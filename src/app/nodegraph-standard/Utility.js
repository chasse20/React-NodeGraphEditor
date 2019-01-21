export default class Utility
{
	static DefaultData( tPrimarySource, tSecondarySource, tDefaultValue )
	{
		if ( tPrimarySource !== undefined )
		{
			return tPrimarySource;
		}
		else if ( tSecondarySource !== undefined )
		{
			return tSecondarySource;
		}
		
		return tDefaultValue;
	}
}