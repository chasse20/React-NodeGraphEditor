import TypeModel from "../../nodegraph/Type";

export default class Type
{
	static FromJSON( tJSON, tSerializableModels, tSerializableViews, tVersion )
	{
		if ( tJSON != null && tJSON.name != null && tSerializableModels != null && tSerializableViews != null )
		{
			// Model class
			var tempModelClass = tJSON.modelClass == null ? null : tSerializableModels[ tJSON.modelClass ];
			if ( tempModelClass == null )
			{
				tempModelClass = tSerializableModels[ "default" ];
			}
			
			// View class
			var tempViewClass = tJSON.viewClass == null ? null : tSerializableViews[ tJSON.viewClass ];
			if ( tempViewClass == null )
			{
				tempViewClass = tSerializableViews[ "default" ];
			}
			
			const tempType = new TypeModel( tJSON.name, tempModelClass, tempViewClass );
			Type.Read( tempType, tJSON, tVersion );
			
			return tempType;
		}
		
		return null;
	}
	
	static Read( tTypeModel, tJSON, tVersion )
	{
		if ( tTypeModel != null && tJSON != null && tJSON.data != null )
		{
			tTypeModel.data = Object.assign( tTypeModel.data, tJSON.data ); // merge/overwrite!
		}
	}
	
	static Write( tTypeModel, tSerializableModels, tSerializableViews )
	{
		if ( tTypeModel != null && tSerializableModels != null && tSerializableViews != null )
		{
			const tempJSON =
			{
				name: tTypeModel._name
			};
			
			// Types
			if ( tTypeModel._modelClass !== tSerializableModels[ "default" ] )
			{
				tempJSON.modelClass = tTypeModel._modelClass.name;
			}
			
			if ( tTypeModel._viewClass !== tSerializableViews[ "default" ] )
			{
				tempJSON.viewClass = tTypeModel._viewClass.name;
			}
			
			// Data			
			for ( let tempKey in tTypeModel.data )
			{
				tempJSON.data = tTypeModel.data;
				break;
			}
			
			return tempJSON;
		}
		
		return null;
	}
}