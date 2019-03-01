export default class GUID
{
	static get ID()
	{
		// TODO: Real GUID or think about the solution more
		return ++GUID._ID;
	}
}

GUID._ID = 0;