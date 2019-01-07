import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Interface from "./interface/views/Interface";
import Graph from "./nodegraph/views/Graph";
import Transform2DModel from "./core/Transform2D";
import GraphModel from "./nodegraph/Graph";
import InterfaceModel from "./interface/Interface";
import "./App.css";

export default class App extends Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._interface = null;
		this._viewTransform = new Transform2DModel();
		this._worldTransform = new Transform2DModel();
		this._graphModel = new GraphModel();
		this._graphModel._transform.parent = this._worldTransform;
		this._interfaceModel = new InterfaceModel();
		
		// Events
		this._onInterface = ( tComponent ) => { this._interface = tComponent; };
		this._onSelectGraph = ( tEvent, tGraph ) => { this._interface.onSelectGraph( tEvent, tGraph ); };
		this._onSelectNode = ( tEvent, tNode ) => { this._interface.onSelectNode( tEvent, tNode ); };
		this._onSelectEdge = ( tEvent, tEdge ) => { this._interface.onSelectEdge( tEvent, tEdge ); };
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
		return (
			<React.Fragment>
				<Switch>
					<Route path="/date" render={
						( tProps ) =>
						(
							<Graph model={ this._graphModel } viewTransform={ this._viewTransform } grid={ this._interfaceModel._controls._grid } physics={ this._interfaceModel._controls._physics } onSelectGraph={ this._onSelectGraph } onSelectNode={ this._onSelectNode } onSelectEdge={ this._onSelectEdge }/>
						)
					}/>
					<Route render={
						( tProps ) =>
						(
							<Graph model={ this._graphModel } viewTransform={ this._viewTransform } grid={ this._interfaceModel._controls._grid } physics={ this._interfaceModel._controls._physics } onSelectGraph={ this._onSelectGraph } onSelectNode={ this._onSelectNode } onSelectEdge={ this._onSelectEdge }/>
						)
					}/>
				</Switch>
				<Interface ref={ this._onInterface } model={ this._interfaceModel } viewTransform={ this._viewTransform } graph={ this._graphModel }/>
			</React.Fragment>
		);
	}
}