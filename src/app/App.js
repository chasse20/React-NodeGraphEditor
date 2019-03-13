/**
*	@namespace core
*/

/**
*	@namespace nodegraph-base
*/

/**
*	@namespace nodegraph
*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "./nodegraph/models/Graph";
import Interface from "./nodegraph/views/interface/Interface";
import Graph from "./nodegraph/views/graph/Graph";
import Style from './App.module.css';

class App extends Component
{
	componentDidMount()
	{
		this.props.graph._physics.seedCenter();
		this.props.graph._physics.restart();
	}

	render( tStyle = Style )
	{
		return (
			<div className={ tStyle.app }>
				<Graph model={ this.props.graph } isEditable={ this.props.isEditable }/>
				{
					this.props.isInterface &&
						<Interface graph={ this.props.graph } isEditable={ this.props.isEditable } isMenu={ this.props.isMenu }/>
				}
			</div>
		);
	}
}

App.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired,
	isInterface: PropTypes.bool.isRequired,
	isMenu: PropTypes.bool.isRequired,
	isEditable: PropTypes.bool.isRequired
};

App.defaultProps =
{
	graph: new GraphModel(),
	isInterface: true,
	isMenu: true,
	isEditable: true
};

export default observer( App );