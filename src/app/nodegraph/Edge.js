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
	
	static CreateFromJSON( tJSON, tSource, tNodeRefs, tTypes, tDefaultType )
	{
		if ( tJSON != null && tJSON.node !== undefined && tJSON.pin !== undefined && tNodeRefs != null )
		{			
			const tempTargetNode = tNodeRefs[ tJSON.node ];
			if ( tempTargetNode != null )
			{
				const tempType = tJSON.type === undefined || tTypes == null ? tDefaultType : tTypes[ tJSON.type ];
				if ( tempType != null )
				{
					const tempEdge = Edge.CreateFromType( tempType, tSource, tempTargetNode._pins[ tJSON.pin ] );
					if ( tempEdge !== null )
					{
						tempEdge.fromJSON( tJSON );
						
						return tempEdge;
					}
				}
			}
		}
		
		return null;
	}
	
	toJSON()
	{
		const tempJSON =
		{
			node: this._target._node._id,
			pin: this._target._name,
			type: this._type._name
		};
		
		// Data
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