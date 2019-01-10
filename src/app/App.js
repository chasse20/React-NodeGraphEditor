import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Graph from "./nodegraph/views/graph/Graph";
import GraphModel from "./nodegraph/Graph";
import "./App.css";

export default class App extends Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._graph = new GraphModel();
		
		// Events
		/*this._onInterface = ( tComponent ) => { this._interface = tComponent; };
		this._onSelectGraph = ( tEvent, tGraph ) => { this._interface.onSelectGraph( tEvent, tGraph ); };
		this._onSelectNode = ( tEvent, tNode ) => { this._interface.onSelectNode( tEvent, tNode ); };
		this._onSelectEdge = ( tEvent, tEdge ) => { this._interface.onSelectEdge( tEvent, tEdge ); };*/
	}
	
	render()
	{
		return (
			<React.Fragment>
				<Switch>
					<Route render={
						( tProps ) =>
						(
							<Graph data={ this._graph }/>
						)
					}/>
				</Switch>
			</React.Fragment>
		);
	}
}