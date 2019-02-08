import React from "react";
import PropTypes from "prop-types";
import InterfaceBase from "../../../../nodegraph/views/interface/interface/Interface";
import GraphModel from "../../../models/Graph";
import Controls from "../../../../nodegraph/views/interface/controls/Controls";
import Menu from "../menu/Menu";

export default class Interface extends InterfaceBase
{	
	render()
	{
		return (
			<div className={ this.state.isOpen ? "interface open" : "interface" }>
				<Controls graph={ this.props.graph } onMenuToggle={ this._onMenuToggle }/>
				<Menu graph={ this.props.graph }/>
			</div>
		);
	}
}

Interface.propTypes = Object.assign(
	{},
	InterfaceBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);