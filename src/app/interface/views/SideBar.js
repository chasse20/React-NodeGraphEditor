import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import MenuModel from "../Menu";
import ControlsModel from "../Controls";
import Transform2DModel from "../../core/Transform2D";
import Menu from "./Menu";
import Controls from "./Controls";
import "./SideBar.css";

class SideBar extends React.Component // TODO: Primitive Component
{
	render()
	{
		return (
			<div className={ this.props.menu.isOpen ? "sidebar open" : "sidebar" }>
				<Menu/>
				<Controls model={ this.props.controls } menu={ this.props.menu } viewTransform={ this.props.viewTransform }/>
			</div>
		);
	}
}

export default observer( SideBar );

SideBar.propTypes =
{
	menu: PropTypes.instanceOf( MenuModel ).isRequired,
	controls: PropTypes.instanceOf( ControlsModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};