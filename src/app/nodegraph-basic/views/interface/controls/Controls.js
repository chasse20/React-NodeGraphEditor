import React from "react";
import PropTypes from "prop-types";
import OptionsModel from "../../../models/Options";
import GraphModel from "../../../models/Graph";
import SelectionMode from "../control-selection-mode/SelectionMode";
import DeleteButton from "../control-delete-button/DeleteButton";
import GridToggle from "../control-grid-toggle/GridToggle";
import GridSnapToggle from "../control-grid-snap-toggle/GridSnapToggle";
import PhysicsToggle from "../control-physics-toggle/PhysicsToggle";
import "./Controls.css";

export default class Controls extends React.Component // TODO: Primitive Component
{	
	render()
	{
		return (
			<div className="controls">
				<SelectionMode graph={ this.props.graph } options={ this.props.options }/>
				<DeleteButton graph={ this.props.graph }/>
				<div>
					<GridToggle options={ this.props.options }/>
					<GridSnapToggle options={ this.props.options }/>
				</div>
				<PhysicsToggle options={ this.props.options }/>
			</div>
		);
	}
}

Controls.propTypes =
{
	options: PropTypes.instanceOf( OptionsModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};