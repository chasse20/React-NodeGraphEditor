export default class GUID
{
	static _ID = 0;
	
	static get ID()
	{
		// TODO: Real GUID or think about the solution more
		return ++GUID._ID;
	}
};