import React, { Component } from "react";
import { Switch, Route } from "react-router";
import File from "./interface/views/File";
import Graph from "./nodegraph/views/Graph";
import Transform2DModel from "./core/Transform2D";
import GraphModel from "./nodegraph/Graph";
import "./App.css";

export default class App extends Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._interface = null;
		this._model =
		{
			graph: new GraphModel(),
			version: 1 
		};
		
		// Events
		/*this._onInterface = ( tComponent ) => { this._interface = tComponent; };
		this._onSelectGraph = ( tEvent, tGraph ) => { this._interface.onSelectGraph( tEvent, tGraph ); };
		this._onSelectNode = ( tEvent, tNode ) => { this._interface.onSelectNode( tEvent, tNode ); };
		this._onSelectEdge = ( tEvent, tEdge ) => { this._interface.onSelectEdge( tEvent, tEdge ); };*/
	}

	toJSON()
	{
		const tempJSON = {};

		// Graph
		var tempObject = this._graphModel.toJSON();
		if ( tempObject != null )
		{
			tempJSON.graph = tempObject;
		}

		return tempJSON;
	}
	
	render()
	{
		/*
		<Switch>
					<Route path="/date" render={
						( tProps ) =>
						(
						)
					}/>
					<Route render={
						( tProps ) =>
						(
						)
					}/>
				</Switch>
				*/
		return (
			<React.Fragment>
				<File model={ this._model }/>
			</React.Fragment>
		);
	}
}