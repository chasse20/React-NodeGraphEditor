import React from "react";
import PropTypes from "prop-types";
import SubMenu from "../submenu/SubMenu";
import GraphModel from "../../../models/Graph";
import GraphVizReader from "../../../formats/GraphVizReader";
import GraphJSONReader from "../../../formats/GraphJSONReader";
import "./Import.css";

export default class Import extends SubMenu
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state.format = 0;

		// Variables
		this._file = null;
		this._formats =
		[
			"GraphViz",
			"GraphJSON"
		];
		
		// Events
		this._onFileInput = ( tEvent ) => { this.onFileInput( tEvent.target.files ); };
		this._onFormat = ( tEvent ) => { console.log( tEvent ); };
		this._onImport = () => { this.onImport(); };
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
				this.selectedFormat.read( this.props.graph, JSON.parse( tEvent.target.result ) );
			};
			
			tempReader.readAsText( this._file );
		}
	}
	
	get selectedFormat()
	{
		if ( this.state.format === 1 )
		{
			return new GraphJSONReader();
		}
		
		return new GraphVizReader();
	}
	
	render()
	{
		return (
			<div className={ this.state.isOpen ? "submenu open" : "submenu" }>
				<button onMouseDown={ this._onStateToggle }><h1>Import</h1></button>
				<div className="submenu-content">
					<input type="file" onChange={ this._onFileInput }/>
					<select onChange={ this._onFormat }>
						{
							this._formats.map(
								( tName, tIndex ) =>
								(
									<option key={ tName } value={ tIndex }>{ tName }</option>
								)
							)
						}
					</select>
					<button onClick={ this._onImport }>Import</button>
				</div>
			</div>
		);
	}
}

Import.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};