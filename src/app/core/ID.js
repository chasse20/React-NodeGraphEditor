/**
*	Singleton for generating an auto-incremented index
*/
export default class ID
{
	/*
		Auto-increments and returns a unique index
		@return {number} Index
	*/
	static get ID()
	{
		return ++ID._ID;
	}
}

/**
*	Unique index that gets auto-incremented
*	@type {number}
*/
ID._ID = 0;