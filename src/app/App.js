import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Graph from "./nodegraph/views/graph/Graph";
import GraphVizReader from "./format/GraphVizReader";
import GraphModel from "./nodegraph/Graph";
import Data from "../data.json";
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
	}

	render()
	{
		return (
			<React.Fragment>
				<Switch>
					<Route render={
						( tProps ) =>
						(
							<Graph model={ this._graph }/>
						)
					}/>
				</Switch>
			</React.Fragment>
		);
	}
}