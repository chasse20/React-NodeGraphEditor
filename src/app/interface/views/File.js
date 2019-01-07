import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import FileSaver from "file-saver";
import GraphModel from "../../nodegraph/Graph";
import "./File.css";

class File extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		/*this._interface = null;
		this._viewTransform = new Transform2DModel();
		this._worldTransform = new Transform2DModel();
		this._graphModel = new GraphModel();
		this._graphModel._transform.parent = this._worldTransform;
		this._interfaceModel = new InterfaceModel();*/
		
		// Events
		this._onImport = () => { this.onImport(); };
		this._onExport = () => { this.onExport(); };
		
		//this.load( Data ); // TODO: make this work only from user input
	}
	
	onImport()
	{
		
	}
	
	onExport()
	{
		FileSaver.saveAs( new Blob( [ JSON.stringify( { graph: this.props.graph } ) ], { type: "application/json" } ), "data.json" ); // format goes here
	}
	
	render()
	{
		return (
			<div className="file">
				<div className="import">
					<h1>Import</h1>
					dropdown for type of import
					<button onMouseDown={ this._onImport }>Import</button>
				</div>
				<div className="export">
					<h1>Export</h1>
					dropdown for type of export
					<button onMouseDown={ this._onExport }>Export</button>
				</div>
			</div>
		);
	}
}

export default observer( File );

File.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};