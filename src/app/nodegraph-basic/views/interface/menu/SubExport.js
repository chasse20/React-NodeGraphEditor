import PropTypes from "prop-types";
import SubExportBase from "../../../../nodegraph/views/interface/menu/SubExport";
import GraphModel from "../../../models/Graph";
import GraphVizWriter from "../../../formats/GraphVizWriter";
import GraphJSONWriter from "../../../formats/GraphJSONWriter";

export default class SubExport extends SubExportBase
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

SubExport.propTypes = Object.assign(
	{},
	SubExportBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);