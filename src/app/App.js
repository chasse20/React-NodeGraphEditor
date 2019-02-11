import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { observer } from "mobx-react";
import Interface from "./nodegraph-basic/views/interface/Interface";
import Graph from "./nodegraph-basic/views/graph/Graph";
import GraphVizReader from "./nodegraph-basic/formats/GraphVizReader";
import GraphJSONReader from "./nodegraph-basic/formats/GraphJSONReader";
import GraphModel from "./nodegraph-basic/models/Graph";
import Data from "../data.json";
import DataGraphJSON from "../graphjson.json";
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
				<Interface graph={ this._graph }/>
			</div>
		);
	}
}

export default observer( App );