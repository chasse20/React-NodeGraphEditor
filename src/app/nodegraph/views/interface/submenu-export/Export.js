import React from "react";
import PropTypes from "prop-types";
import FileSaver from "file-saver";
import SubMenu from "../submenu/SubMenu";
import GraphModel from "../../../models/Graph";
import GraphVizWriter from "../../../formats/GraphVizWriter";
import GraphJSONWriter from "../../../formats/GraphJSONReader";

export default class Export extends SubMenu
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
		this._onFormat = ( tEvent ) => { this.setState( { format: tEvent.target.value } ); };
		this._onExport = () => { this.onExport(); };
	}
	
	onExport()
	{
		FileSaver.saveAs( new Blob( [ JSON.stringify( this.selectedFormat.write( this.props.graph ) ) ], { type: "application/json" } ), "data.json" );
	}
	
	get selectedFormat()
	{
		if ( this.state.format === 1 )
		{
			return new GraphJSONWriter();
		}
		
		return new GraphVizWriter();
	}
	
	render()
	{
		return this.renderSubmenu( "export" );
	}
	
	renderContent()
	{
		return (
			<div className="submenu-content">
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
				<button onClick={ this._onExport }>export</button>
			</div>
		);
	}
}

Export.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};