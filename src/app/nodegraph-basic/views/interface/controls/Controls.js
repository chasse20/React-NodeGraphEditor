import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import ControlsBase from "../../../../nodegraph/views/interface/controls/Controls";
import Physics from "./Physics";

export default class Controls extends ControlsBase
{	
	renderButtons()
	{
		return (
			<React.Fragment>
				{ super.renderButtons() }
				<Physics graph={ this.props.graph }/>
			</React.Fragment>
		);
	}
}

Controls.propTypes = Object.assign(
	{},
	ControlsBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);