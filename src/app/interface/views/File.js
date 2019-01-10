import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import FileSaver from "file-saver";
import GraphVizReader from "../../format/GraphVizReader";
import GraphVizWriter from "../../format/GraphVizWriter";
import "./File.css";

class File extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// Variables
		this._file = null;
		
		// Events
		this._onFileInput = ( tEvent ) => { this.onFileInput( tEvent.target.files ); };
		this._onImport = () => { this.onImport(); };
		this._onExport = () => { this.onExport(); };
	}
	
	onFileInput( tFiles )
	{
		this._file = tFiles == null || tFiles.length === 0 ? null : tFiles[0];
	}
	
	onImport()
	{
		if ( this._file !== null )
		{
			const tempReader = new FileReader();
			tempReader.onload = ( tEvent ) =>
			{
				GraphVizReader.Read( this.props.model, JSON.parse( tEvent.target.result ) );
				console.log( this.props.model );
			};
			tempReader.readAsText( this._file );
		}
	}
	
	onExport()
	{
		const tempJSON = GraphVizWriter.Write( this.props.model );
		console.log( tempJSON );
		FileSaver.saveAs( new Blob( [ JSON.stringify( tempJSON ) ], { type: "application/json" } ), "data.json" ); // format goes here
	}
	
	render()
	{
		return (
			<div className="submenu file">
				<div className="import">
					<h1>IMPORT</h1>
					<div className="inner">
						<input type="file" name="file" onChange={ this._onFileInput }/>
						<select name="format">
							<option value="GraphViz">GraphViz</option>
							<option value="GraphJSON">GraphJSON</option>
						</select>
						<button onMouseDown={ this._onImport }>Import</button>
					</div>
				</div>
				<div className="export">
					<h1>EXPORT</h1>
					<div className="inner">
						<select name="format">
							<option value="GraphViz">GraphViz</option>
							<option value="GraphJSON">GraphJSON</option>
						</select>
						<button onClick={ this._onExport }>Export</button>
					</div>
				</div>
			</div>
		);
	}
}

export default observer( File );

File.propTypes =
{
	model: PropTypes.object.isRequired
};