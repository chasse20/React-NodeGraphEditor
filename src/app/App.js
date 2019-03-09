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
import { observer } from "mobx-react";
import Interface from "./nodegraph/views/interface/Interface";
import Graph from "./nodegraph/views/graph/Graph";
import GraphVizReader from "./nodegraph/formats/GraphVizReader";
import GraphModel from "./nodegraph/models/Graph";
import Data from "../graphviz_nintendo.json";
import Style from './App.module.css';

class App extends Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._graph = new GraphModel();
		
		// Initialize
		( new GraphVizReader() ).read( this._graph, Data );
		this._graph._physics.seedCenter();
		this._graph._physics.restart();
	}

	render( tStyle = Style )
	{
		return (
			<div className={ tStyle.app }>
				<Graph model={ this._graph }/>
				<Interface graph={ this._graph }/>
			</div>
		);
	}
}

export default observer( App );