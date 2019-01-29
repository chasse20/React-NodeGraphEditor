import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Import from "../submenu-import/Import";
import Export from "../submenu-export/Export";

export default class IO extends React.PureComponent
{
	render()
	{
		return (
			<React.Fragment>
				<Import graph={ this.graph }/>
				<Export graph={ this.graph }/>
			</React.Fragment>
		);
	}
}

IO.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};