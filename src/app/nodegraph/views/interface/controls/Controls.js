import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import SelectionMode from "../control-selection-mode/SelectionMode";
import DeleteButton from "../control-delete-button/DeleteButton";
import GridToggle from "../control-grid-toggle/GridToggle";
import GridSnapToggle from "../control-grid-snap-toggle/GridSnapToggle";
import "./Controls.css";

export default class Controls extends React.PureComponent
{	
	render()
	{
		return (
			<div className="controls">
				<SelectionMode graph={ this.props.graph }/>
				<DeleteButton graph={ this.props.graph }/>
				<div>
					<GridToggle graph={ this.props.graph }/>
					<GridSnapToggle graph={ this.props.graph }/>
				</div>
			</div>
		);
	}
}

Controls.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};