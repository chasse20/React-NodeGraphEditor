import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import GraphModel from "./app/nodegraph/models/Graph";
import GraphVizReader from "./app/nodegraph/formats/GraphVizReader";
import Data from "./graphviz_futuretech.json";
import "./index.css";

const tempGraph = new GraphModel();
( new GraphVizReader() ).read( tempGraph, Data );

ReactDOM.render(
	(
		<BrowserRouter>
			<App graph={ tempGraph } isMenu={ true } isEditable={ true } isInterface={ true }/>
		</BrowserRouter>
	),
	document.getElementById( "root" )
);