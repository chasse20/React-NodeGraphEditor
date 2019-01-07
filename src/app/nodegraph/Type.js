import { observable, decorate } from "mobx";

export default class Type
{
	constructor( tName, tModelClass, tViewClass, tData = {} )
	{
		this._name = tName;
		this._modelClass = tModelClass;
		this._viewClass = tViewClass;
		this.data = tData;
	}
	
	toJSON()
	{
		const tempJSON =
		{
			name: this._name,
			modelClass: this._modelClass.name,
			viewClass: this._viewClass.name
		};
		
		for ( let tempKey in this.data )
		{
			tempJSON.data = this.data;
			break;
		}
		
		return tempJSON;
	}
	
	fromJSON( tJSON )
	{
		if ( tJSON != null && tJSON.data !== undefined )
		{
			this.data = Object.assign( this.data, tJSON.data ); // merge/overwrite!
		}
	}
	
	static FromJSON( tJSON, tModelClasses, tViewClasses ) // TODO: Defaults
	{
		if ( tJSON != null && tJSON.name !== undefined && tJSON.modelClass !== undefined && tJSON.viewClass !== undefined && tModelClasses != null && tViewClasses != null )
		{
			const tempModelClass = tModelClasses[ tJSON.modelClass ];
			if ( tempModelClass !== undefined )
			{
				const tempViewClass = tViewClasses[ tJSON.viewClass ];
				if ( tempViewClass !== undefined )
				{
					const tempType = new Type( tJSON.name, tempModelClass, tempViewClass );
					tempType.fromJSON( tJSON );
					
					return tempType;
				}
			}
		}
		
		return null;
	}
}

decorate( Type,
	{
		data: observable
	}
);