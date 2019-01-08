import { observable, decorate, action } from "mobx";

export default class Edge
{
	static SerializableClasses = { "Edge": Edge };
	
	constructor( tType, tSource, tTarget, tData = {} )
	{
		this._type = tType;
		this._source = tSource;
		this._target = tTarget;
		this.data = tData;
		this.isSelected = false;
	}
	
	static CreateFromType( tType, tSource, tTarget, tData )
	{
		if ( tType != null && tSource != null && tTarget != null )
		{
			return new tType._modelClass( tType, tSource, tTarget, tData );
		}
		
		return null;
	}

	get key()
	{
		return this._source.key + this._target.key;
	}
}

decorate( Edge,
	{
		data: observable,
		isSelected: observable,
		fromJSON: action
	}
);