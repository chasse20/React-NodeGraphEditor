import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { observer } from "mobx-react";
import Graph from "./nodegraph-basic/views/graph/graph/Graph";
import Interface from "./nodegraph-basic/views/interface/interface/Interface";
import GraphVizReader from "./nodegraph-basic/formats/GraphVizReader";
import GraphJSONReader from "./nodegraph-basic/formats/GraphJSONReader";
import GraphModel from "./nodegraph-basic/models/Graph";
import OptionsModel from "./nodegraph-basic/models/Options";
import Data from "../data.json";
import DataGraphJSON from "../graphjson.json";
import "./App.css";

class App extends Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._options = new OptionsModel();
		this._graph = new GraphModel();
		( new GraphVizReader() ).read( this._graph, Data );
		//( new GraphJSONReader ).read( this._graph, DataGraphJSON );
	}

	render()
	{
		return (
			<React.Fragment>
				<Interface graph={ this._graph } options={ this._options }/>
				<Graph model={ this._graph } isPanMode={ this._options.isPanMode } isPhysics={ this._options.isPhysics } isGridVisible={ this._options.isGridVisible } isGridSnap={ this._options.isGridSnap }/>
			</React.Fragment>
		);
	}
}

export default observer( App );