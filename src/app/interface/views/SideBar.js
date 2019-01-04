import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../nodegraph/Graph";
import ControlsModel from "../Controls";
import MenuModel from "../Menu";
import Menu from "./Menu";
import Controls from "./Controls";
import "./SideBar.css";

class SideBar extends React.Component // Primitive Component
{
	render()
	{
		return (
			<div className={ this.props.menu.isOpen ? "sidebar open" : "sidebar" }>
				<Menu/>
				<Controls model={ this.props.controls } menu={ this.props.menu } graph={ this.props.graph }/>
			</div>
		);
	}
}

export default observer( SideBar );

SideBar.propTypes =
{
	controls: PropTypes.instanceOf( ControlsModel ).isRequired,
	menu: PropTypes.instanceOf( MenuModel ).isRequired,
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};