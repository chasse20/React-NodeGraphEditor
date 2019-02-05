import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Types from "../sub-menu-types/Types";
import NodeType from "../sub-item-nodetype/NodeType";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/Type";

class NodeTypes extends Types
{
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
				<div>
					{
						Object.keys( this.props.graph._nodeTypes ).map(
							( tKey ) =>
							(
								<NodeType graph={ this.props.graph } model={ this.props.graph._nodeTypes[ tKey ] } key={ tKey }/>
							)
						)
					}
				</div>
				{ super.renderContent() }
			</React.Fragment>
		);
	}
}

NodeTypes.propTypes =
{
	graph: PropTypes.instanceOf( GraphModel ).isRequired
};

export default observer( NodeTypes );