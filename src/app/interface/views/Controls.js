import React from "react";
import PropTypes from "prop-types";
import Transform2DModel from "../../core/Transform2D";
import ControlsModel from "../Controls";
import MenuModel from "../Menu";
import MenuToggle from "./MenuToggle";
import SelectionControls from "./SelectionControls";
import DeleteButton from "./DeleteButton";
import GridToggle from "./GridToggle";
import GridToggleSnap from "./GridToggleSnap";
import ZoomControls from "./ZoomControls";
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
					<DeleteButton model={ this.props.model._selection } onDelete={ this.props.onDelete }/>
					<div>
						<GridToggle model={ this.props.model._grid }/>
						<GridToggleSnap model={ this.props.model._selection }/>
					</div>
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
	onDelete: PropTypes.func.isRequired
};