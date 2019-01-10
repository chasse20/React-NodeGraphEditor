import React from "react";
import PropTypes from "prop-types";
import Transform2DModel from "../../core/Transform2D";
import GraphModel from "../../nodegraph/Graph";
import ControlsModel from "../Controls";
import MenuModel from "../Menu";
import MenuToggle from "./MenuToggle";
import SelectionControls from "./SelectionControls";
import DeleteButton from "./DeleteButton";
import GridToggle from "./GridToggle";
import GridToggleSnap from "./GridToggleSnap";
import ZoomControls from "./ZoomControls";
import PhysicsToggle from "./PhysicsToggle";
import "./Controls.css";

export default class Controls extends React.Component // TODO: Primitive Component
{	
	render()
	{
		return (
			<nav>
				<MenuToggle model={ this.props.menu }/>
				<div className="buttons">
					<SelectionControls model={ this.props.model._selection }/>
					<DeleteButton model={ this.props.model._selection } graph={ this.props.graph }/>
					<div>
						<GridToggle model={ this.props.model._grid }/>
						<GridToggleSnap model={ this.props.model._selection }/>
					</div>
					<PhysicsToggle model={ this.props.model._physics }/>
					<ZoomControls viewTransform={ this.props.viewTransform }/>
				</div>
			</nav>
		);
	}
}

Controls.propTypes =
{
	model: PropTypes.instanceOf( ControlsModel ).isRequired,
	menu: PropTypes.instanceOf( MenuModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};