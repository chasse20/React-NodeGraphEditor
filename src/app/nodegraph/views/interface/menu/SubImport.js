import React from "react";
import PropTypes from "prop-types";
import Sub from "./Sub";
import GraphModel from "../../../models/Graph";
import GraphVizReader from "../../../formats/GraphVizReader";
import GraphJSONReader from "../../../formats/GraphJSONReader";
import Style from "./Sub.module.css";

export default class SubImport extends Sub
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
		this._onFormat = ( tEvent ) => { this.setState( { format: parseInt( tEvent.target.value ) } ); };
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
				this.props.graph._physics.restart();
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
	
	renderContent( tStyle = Style )
	{
		return (
			<React.Fragment>
				<div className={ tStyle.kvp }>
					<span>File</span>
					<input type="file" onChange={ this._onFileInput }/>
					<span>Format</span>
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
				</div>
				<div className={ tStyle.buttons }>
					<button className={ tStyle.button } onClick={ this._onImport }>import</button>
				</div>
			</React.Fragment>
		);
	}
}

SubImport.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	Sub.propTypes
);

SubImport.defaultProps =
{
	title: "import file"
};