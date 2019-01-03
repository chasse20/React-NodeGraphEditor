import React, { Component } from "react";
import { Switch, Route } from "react-router";
import FileSaver from "file-saver";
import Interface from "./interface/views/Interface";
import Graph from "./nodegraph/views/Graph";
import GraphModel from "./nodegraph/Graph";
import InterfaceModel from "./interface/Interface";
import Data from "../data.json";
import "./App.css";

export default class App extends Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._interface = null;
		this._graphModel = new GraphModel();
		this._interfaceModel = new InterfaceModel();
		
		// Events
		this._onInterface = ( tComponent ) => { this._interface = tComponent; };
		this._onSelectGraph = ( tEvent, tGraph ) => { this._interface.onSelectGraph( tEvent, tGraph ); };
		this._onSelectNode = ( tEvent, tNode ) => { this._interface.onSelectNode( tEvent, tNode ); };
		this._onSelectEdge = ( tEvent, tEdge ) => { this._interface.onSelectEdge( tEvent, tEdge ); };
		
		this.load( Data ); // TODO: make this work only from user input
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
	
	save()
	{
		FileSaver.saveAs( new Blob( [ JSON.stringify( this ) ], { type: "application/json" } ), "data.json" );
	}

	load( tJSON )
	{
		if ( tJSON != null )
		{
			this._graphModel.fromJSON( tJSON.graph );
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
							<Graph model={ this._graphModel } selection={ this._interfaceModel._controls._selection } grid={ this._interfaceModel._controls._grid } onSelectGraph={ this._onSelectGraph } onSelectNode={ this._onSelectNode } onSelectEdge={ this._onSelectEdge }/>
						)
					}/>
					<Route render={
						( tProps ) =>
						(
							<Graph model={ this._graphModel } selection={ this._interfaceModel._controls._selection } grid={ this._interfaceModel._controls._grid } onSelectGraph={ this._onSelectGraph } onSelectNode={ this._onSelectNode } onSelectEdge={ this._onSelectEdge }/>
						)
					}/>
				</Switch>
				<Interface ref={ this._onInterface } model={ this._interfaceModel } viewTransform={ this._graphModel._transform }/>
			</React.Fragment>
		);
	}
}