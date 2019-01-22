import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Graph from "./nodegraph-basic/views/graph/graph/Graph";
import GraphVizReader from "./nodegraph-basic/formats/GraphVizReader";
import GraphJSONReader from "./nodegraph-basic/formats/GraphJSONReader";
import GraphModel from "./nodegraph-basic/models/Graph";
import Data from "../data.json";
import DataGraphJSON from "../graphjson.json";
import "./App.css";

export default class App extends Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._graph = new GraphModel();
		( new GraphVizReader ).read( this._graph, Data );
		//( new GraphJSONReader ).read( this._graph, DataGraphJSON );
	}

	render()
	{
		return (
			<Graph model={ this._graph }/>
		);
	}
}