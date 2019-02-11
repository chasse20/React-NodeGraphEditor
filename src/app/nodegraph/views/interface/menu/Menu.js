import React from "react";
import PropTypes from "prop-types";
import GraphModel from "../../../models/Graph";
import Style from "./Menu.module.css";

export default class Menu extends React.PureComponent
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );
		
		// State
		this.state =
		{
			tab: 0
		};
		
		// Variables
		this._tabs =
		[
			"i/o",
			"graph"
		];
	}
	
	render( tStyle = Style )
	{
		return (
			<div className={ tStyle.menu }>
				<div className={ tStyle.inner }>
					<div className={ tStyle.tabs }>
						{
							this._tabs.map(
								( tTitle, tIndex ) =>
								(
									<button className={ tStyle.tab } key={ tTitle } disabled={ tIndex === this.state.tab } style={ { width: ( 100 / this._tabs.length ) + "%" } } onMouseDown={ () => { this.setState( { tab: tIndex } ); } }>{ tTitle }</button>
								)
							)
						}
					</div>
					<div className={ tStyle.content }>
						{ this.renderContent() }
					</div>
				</div>
			</div>
		);
	}
	
	renderContent()
	{
		/*switch ( this.state.tab )
		{
			case 0: // I/O
				return (
					<React.Fragment>
						<Import graph={ this.props.graph }/>
						<Export graph={ this.props.graph }/>
					</React.Fragment>
				);
			case 1: // Graph
				return (
					<React.Fragment>
						<NodeTypes graph={ this.props.graph }/>
						<EdgeTypes graph={ this.props.graph }/>
					</React.Fragment>
				);
			default:
				break;
		}*/
		
		return null;
	}
}

Menu.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};