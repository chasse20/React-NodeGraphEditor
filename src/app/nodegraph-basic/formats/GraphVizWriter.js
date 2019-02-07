import GraphVizWriterBase from "../../nodegraph/formats/GraphVizWriter";

export default class GraphVizWriter extends GraphVizWriterBase
{	
	writeNodeType( tTypeModel )
	{
		const tempJSON = super.writeNodeType( tTypeModel );
		
		if ( tempJSON != null )
		{
			// Radius
			if ( tTypeModel.radius !== 50 )
			{
				tempJSON.radius = tTypeModel.radius;
			}
			
			// Stroke
			if ( tTypeModel.stroke !== "#808080" )
			{
				tempJSON.stroke = tTypeModel.stroke;
			}
			
			// Fill
			if ( tTypeModel.fill !== "#a9a9a9" )
			{
				tempJSON.fill = tTypeModel.fill;
			}
			
			return tempJSON;
		}

		return null;
	}
	
	writeEdgeTypes( tTypes )
	{
		if ( tTypes != null )
		{
			var tempTypesJSON = null;
			for ( let tempKey in tTypes )
			{
				let tempType = this.writeEdgeType( tTypes[ tempKey ] );
				if ( tempType != null )
				{
					if ( tempTypesJSON == null )
					{
						tempTypesJSON = [];
					}
					tempTypesJSON.push( tempType );
				}
			}
			
			return tempTypesJSON;
		}
		
		return null;
	}
	
	writeEdgeType( tTypeModel )
	{
		const tempJSON = super.writeNodeType( tTypeModel );
		
		if ( tempJSON != null )
		{
			// Stroke
			if ( tTypeModel.stroke !== "#808080" )
			{
				tempJSON.stroke = tTypeModel.stroke;
			}
			
			// Text
			if ( tTypeModel.text !== "" )
			{
				tempJSON.text = tTypeModel.text;
			}
			
			return tempJSON;
		}

		return null;
	}
	
	writeNode( tNodeModel )
	{
		const tempJSON = super.writeNode( tNodeModel );
		
		if ( tempJSON != null )
		{
			// Text
			if ( tNodeModel.text !== "" )
			{
				tempJSON.text = tNodeModel.text;
			}
			
			// Data
			for ( let tempKey in tNodeModel.data )
			{
				if ( tempJSON.data == null )
				{
					tempJSON.data = {};
				}
				
				tempJSON.data[ tempKey ] = tNodeModel.data[ tempKey ];
			}
			
			return tempJSON;
		}
		
		return null;
	}
}