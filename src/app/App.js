import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { observer } from "mobx-react";
import Graph from "./nodegraph/views/graph/graph/Graph";
import Interface from "./nodegraph/views/interface/interface/Interface";
import GraphVizReader from "./nodegraph/formats/GraphVizReader";
import GraphJSONReader from "./nodegraph/formats/GraphJSONReader";
import GraphModel from "./nodegraph/models/Graph";
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
		this._graph = new GraphModel();
		( new GraphVizReader() ).read( this._graph, Data );
		//( new GraphJSONReader() ).read( this._graph, DataGraphJSON );
	}

	render()
	{
		return (
			<React.Fragment>
				<Interface graph={ this._graph }/>
				<Graph model={ this._graph }/>
			</React.Fragment>
		);
	}
}

export default observer( App );