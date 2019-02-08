import PropTypes from "prop-types";
import ExportBase from "../../../../nodegraph/views/interface/menu-sub-export/Export";
import GraphModel from "../../../models/Graph";
import GraphVizWriter from "../../../formats/GraphVizWriter";
import GraphJSONWriter from "../../../formats/GraphJSONWriter";

export default class Export extends ExportBase
{
	get selectedFormat()
	{
		if ( this.state.format === 1 )
		{
			return new GraphJSONWriter();
		}
		
		return new GraphVizWriter();
	}
}

Export.propTypes = Object.assign(
	{},
	ExportBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);