import PropTypes from "prop-types";
import ImportBase from "../../../../nodegraph/views/interface/menu-sub-import/Import";
import GraphModel from "../../../models/Graph";
import GraphVizReader from "../../../formats/GraphVizReader";
import GraphJSONReader from "../../../formats/GraphJSONReader";

export default class Import extends ImportBase
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

Import.propTypes = Object.assign(
	{},
	ImportBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);