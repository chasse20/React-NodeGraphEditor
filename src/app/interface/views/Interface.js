import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import InterfaceModel from "../Interface";
import Transform2DModel from "../../core/Transform2D";
import Panel from "./Panel";
import Controls from "./Controls";
import "./Interface.css";

class Interface extends React.Component
{
	render()
	{
		return (
			<div className={ this.props.model._menu.isOpen ? "interface open" : "interface" }>
				<Panel/>
				<Controls model={ this.props.model._controls } menu={ this.props.model._menu } viewTransform={ this.props.viewTransform }/>
			</div>
		);
	}
}

export default observer( Interface );

Interface.propTypes =
{
	model: PropTypes.instanceOf( InterfaceModel ).isRequired,
	viewTransform: PropTypes.instanceOf( Transform2DModel ).isRequired
};