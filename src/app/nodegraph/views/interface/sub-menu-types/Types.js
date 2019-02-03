import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import SubMenu from "../sub-menu/SubMenu";
import NodeType from "../sub-item-nodetype/NodeType";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/Type";

class NodeTypes extends SubMenu
{
	constructor( tProps )
	{
		// Inheritance
		super( tProps );

		// State
		this.state.newKey = "";
		
		// Events
		this._onNewText = ( tEvent ) => { this.setState( { newKey: tEvent.target.value } ); };
		this._onNew = () => { this.onNew(); };
	}
	
	onNew()
	{
		if ( this.state.newKey !== "" && this.props.graph._nodeTypes[ this.state.newKey ] === undefined )
		{
			this.props.graph.setNodeType( new TypeModel( this.state.newKey ) );
		}
	}
	
	render()
	{
		return this.renderSubmenu( "node types" );
	}
	
	renderContent()
	{
		return (
			<React.Fragment>
				<div className="items">
					{
						Object.keys( this.props.graph._nodeTypes ).map(
							( tKey ) =>
							(
								<NodeType graph={ this.props.graph } model={ this.props.graph._nodeTypes[ tKey ] } key={ tKey }/>
							)
						)
					}
				</div>
				<div className="new">
					<input type="text" value={ this.newKey } onChange={ this._onNewText }/>
					<button onClick={ this._onNew }>new type</button>
				</div>
			</React.Fragment>
		);
	}
}

NodeTypes.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( NodeTypes );