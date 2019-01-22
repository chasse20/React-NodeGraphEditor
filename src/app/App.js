import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Graph from "./nodegraph/views/graph/graph/Graph";
import GraphVizReader from "./nodegraph/formats/GraphVizReader";
import GraphJSONReader from "./nodegraph/formats/GraphJSONReader";
import GraphModel from "./nodegraph/models/Graph";
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
		GraphVizReader.Read( this._graph, Data );
		//GraphJSONReader.Read( this._graph, DataGraphJSON );
	}

	render()
	{
		return (
			<Graph model={ this._graph }/>
		);
	}
}