import React from "react";
import PropTypes from "prop-types";
import FileSaver from "file-saver";
import GraphModel from "../../../models/Graph";
import GraphVizReader from "../../../formats/GraphVizReader";
import GraphJSONReader from "../../../formats/GraphJSONReader";
import GraphSONReader from "../../../../nodegraph/formats/GraphSONReader";
//import { searchComplex } from "common-components/lib/js/searchController";
import "./IO.css";

export default class IO extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state =
		{
			APIGetURL: "",
			reader: 0
		};

		// Variables
		this._file = null;
		
		// Events
		this._onFileInput = ( tEvent ) => { this.onFileInput( tEvent.target.files ); };
		this._onImport = () => { this.onImport(); };
		this._onExport = () => { this.onExport(); };
		this._onAPIGetURL = ( tEvent ) => { this.onAPIGetURL( tEvent ); };
		this._onAPIGet = () => { this.onAPIGet(); };
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
				var tempReader = null;
				switch ( this.state.reader )
				{
					case 1: // GraphJSON
						tempReader = new GraphJSONReader();
						break;
					case 2: // GraphSON
						tempReader = new GraphSONReader();
						break;
					default: // GraphViz
						tempReader = new GraphVizReader();
						break;
				}
				
				tempReader.read( this.props.graph, JSON.parse( tEvent.target.result ) );
				console.log( this.props.graph );
			};
			tempReader.readAsText( this._file );
		}
	}
	
	onExport()
	{
		//FileSaver.saveAs( new Blob( [ JSON.stringify( GraphVizWriter.Write( this.props.graph ) ) ], { type: "application/json" } ), "data.json" ); // format goes here
	}
	
	onAPIGetURL( tEvent )
	{
		this.setState( { APIGetURL: tEvent.target.value } );
	}
	
	onAPIGet()
	{
		const testRequest = {"type":"OEDocument","pageSize":10,"pageNumber":1,"propertyNames":["OEDocumentRecordset.DocumentSource","OEDocumentRecordset.NER_LOCATION","OEDocumentRecordset.NER_ORGANIZATION","OEDocumentRecordset.NER_PERSON","OEDocumentRecordset.DocumentTitle"],"group":{"operator":"AND","criteria":[{"key":"9bdd1676-1110-4fed-8bbe-ece438fd95d7","recordset":"CoalesceEntity","field":"name","operator":"EqualTo","value":"OEDocument","matchCase":false}],"groups":[]}};
		
		fetch( "oedevnode26:8181/cxf/data/search/complex",
			{
				method: "XPOST",
				headers:
				{
					"content-type": "application/json",
				},
				body: JSON.stringify( testRequest )
			}
		).then(
			( tResponse ) =>
			{
				return new GraphSONReader().read( this.props.graph, tResponse );
			}
		);

		/*searchComplex( JSON.stringify( testRequest ) ).then(
			( tData ) =>
			{ 
				return new GraphSONReader().read( this.props.graph, tData );
			}
		);*/
	}
	
	render()
	{
		return (
			<div className="submenu file">
				<div className="import">
					<h1>IMPORT</h1>
					<div className="inner">
						<input type="file" onChange={ this._onFileInput }/>
						<select onChange={ this._onImportFormat }>
							<option value="GraphViz">GraphViz</option>
							<option value="GraphJSON">GraphJSON</option>
							<option value="GraphSON">GraphJSON</option>
						</select>
						<button onMouseDown={ this._onImport }>Import</button>
					</div>
				</div>
				<div className="export">
					<h1>EXPORT</h1>
					<div className="inner">
						<select onChange={ this._onExportFormat }>
							<option value="GraphViz">GraphViz</option>
							<option value="GraphJSON">GraphJSON</option>
						</select>
						<button onClick={ this._onExport }>Export</button>
					</div>
				</div>
				<div className="api">
					<h1>API REQUEST</h1>
					<div className="inner">
						<select onChange={ this._onAPIGetFormat }>
							<option value="GraphSON">GraphSON</option>
						</select>
						<button onClick={ this._onAPIGet }>Get</button>
					</div>
				</div>
			</div>
		);
	}
}

IO.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};