import React, { Component } from "react";
import { Switch, Route } from "react-router";
import FileSaver from "file-saver";
import Interface from "./interface/views/Interface";
import InterfaceModel from "./interface/Interface";
import Graph from "./nodegraph/views/Graph";
import GraphModel from "./nodegraph/Graph";
import Data from "../data.json";
import "./App.css";

export default class App extends Component
{
	static Instance = null;

	constructor( tProps )
	{
		super( tProps );

		App.Instance = this;
		this._graph = new GraphModel(); // TODO: dynamic???
		this._interface = new InterfaceModel();
		
		this.load( Data ); // TODO: make this work only from user input
	}

	toJSON()
	{
		const tempJSON = {};

		// Graph
		var tempObject = this._graph.toJSON();
		if ( tempObject != null )
		{
			tempJSON.graph = tempObject;
		}
		
		// Interface
		tempObject = this._interface.toJSON();
		if ( tempObject != null )
		{
			tempJSON.interface = tempObject;
		}

		return tempJSON;
	}
	
	save()
	{
		FileSaver.saveAs( new Blob( [ JSON.stringify( this ) ], { type: "application/json" } ), "data.json" );
	}

	load( tJSON )
	{
		if ( tJSON != null )
		{
			this._graph.fromJSON( tJSON.graph );
			this._interface.fromJSON( tJSON.interface );
		}
	}

	render()
	{
		return (
			<React.Fragment>
				<Switch>
					<Route path="/date" render={
						( tProps ) =>
						(
							<Graph model={ this._graph } grid={ this._interface._grid } selection={ this._interface._selection }/>
						)
					}/>
					<Route render={
						( tProps ) =>
						(
							<Graph model={ this._graph } grid={ this._interface._grid } selection={ this._interface._selection }/>
						)
					}/>
				</Switch>
				<Interface model={ this._interface } viewTransform={ this._graph._transform }/>
			</React.Fragment>
		);
	}
}