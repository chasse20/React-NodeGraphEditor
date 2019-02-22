import React from "react";
import PropTypes from "prop-types";
import FileSaver from "file-saver";
import Sub from "./Sub";
import GraphModel from "../../../models/Graph";
import GraphVizWriter from "../../../formats/GraphVizWriter";
import GraphJSONWriter from "../../../formats/GraphJSONWriter";
import Style from "./Sub.module.css";

export default class SubExport extends Sub
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
		this._onFormat = ( tEvent ) => { this.setState( { format: parseInt( tEvent.target.value ) } ); };
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
	
	renderContent( tStyle = Style )
	{
		return (
			<React.Fragment>
				<div className={ tStyle.kvp }>
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
					<button className={ tStyle.button } onClick={ this._onExport }>export</button>
				</div>
			</React.Fragment>
		);
	}
}

SubExport.propTypes = Object.assign(
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	},
	Sub.propTypes
);

SubExport.defaultProps =
{
	title: "export file"
};