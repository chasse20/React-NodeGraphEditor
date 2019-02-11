import React from "react";
import PropTypes from "prop-types";
import { set, remove, get, has } from "mobx";
import { observer } from "mobx-react";
import Icons from "../../../../nodegraph/views/Icons";
import Style from "./Data.module.css";

class Data extends React.Component
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state =
		{
			newKey: ""
		};
		
		// Events
		this._onNewText = ( tEvent ) => { this.setState( { newKey: tEvent.target.value } ); };
		this._onNew = () => { this.onNew(); };
	}
	
	onNew()
	{
		const tempKey = this.state.newKey;
		if ( tempKey !== "" )
		{
			const tempData = this.props.data;
			if ( !has( tempData, tempKey ) )
			{
				set( tempData, tempKey, "" );
			}
		}
	}
	
	render( tStyle = Style )
	{
		const tempData = this.props.data;
		
		return (
			<React.Fragment>
				<div className={ tStyle.data }>
					{
						Object.keys( tempData ).map(
							( tKey ) =>
							(
								<React.Fragment key={ tKey }>
									<span>{ tKey }</span>
									<input type="text" value={ get( tempData, tKey ) } onChange={ ( tEvent ) => { set( tempData, tKey, tEvent.target.value); } }/>
									<button className={ tStyle.button } onClick={ () => { remove( tempData, tKey ); } }>
										{ Icons.delete }
									</button>
								</React.Fragment>
							)
						)
					}
				</div>
				<div className={ tStyle.new }>
					<input type="text" value={ this.newKey } placeholder="Enter Field Name..." onChange={ this._onNewText }/>
					<button className={ tStyle.create } onClick={ this._onNew }>new field</button>
				</div>
			</React.Fragment>
		);
	}
}

Data.propTypes =
{
	data: PropTypes.object.isRequired
};

export default observer( Data );