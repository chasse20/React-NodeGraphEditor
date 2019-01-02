export default class Utility
{
	static DefaultData( tKey, tPrimarySource, tSecondarySource, tDefaultValue )
	{
		if ( tPrimarySource[ tKey ] !== undefined )
		{
			return tPrimarySource[ tKey ];
		}
		else if ( tSecondarySource[ tKey ] !== undefined )
		{
			return tSecondarySource[ tKey ];
		}
		
		return tDefaultValue;
	}
}