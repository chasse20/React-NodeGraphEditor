import React, { Component } from "react";
//import { Switch, Route } from "react-router";
import { observer } from "mobx-react";
//import Interface from "./nodegraph/views/interface/Interface";
import Controls from "./nodegraph-base/views/controls/Controls";
import Graph from "./nodegraph-base/views/graph/Graph";
import GraphVizReader from "./nodegraph-base/formats/GraphVizReader";
//import GraphJSONReader from "./nodegraph/formats/GraphJSONReader";
import GraphModel from "./nodegraph-base/models/Graph";
import Data from "../data.json";
//import DataGraphJSON from "../graphjson.json";
import Style from './App.module.css';

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

	render( tStyle = Style )
	{
		return (
			<div className={ tStyle.app }>
				<Graph model={ this._graph }/>
				<Controls graph={ this._graph }/>
			</div>
		);
	}
}

export default observer( App );