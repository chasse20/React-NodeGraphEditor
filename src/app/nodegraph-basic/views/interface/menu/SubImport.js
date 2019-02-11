import PropTypes from "prop-types";
import SubImportBase from "../../../../nodegraph/views/interface/menu/SubImport";
import GraphModel from "../../../models/Graph";
import GraphVizReader from "../../../formats/GraphVizReader";
import GraphJSONReader from "../../../formats/GraphJSONReader";

export default class SubImport extends SubImportBase
{	
	get selectedFormat()
	{
		if ( this.state.format === 1 )
		{
			return new GraphJSONReader();
		}
		
		return new GraphVizReader();
	}
}

SubImport.propTypes = Object.assign(
	{},
	SubImportBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);