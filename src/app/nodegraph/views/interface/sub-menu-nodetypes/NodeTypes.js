import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Items from "../sub-menu-items/Items";
import NodeType from "../sub-item-nodetype/NodeType";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/Type";

class NodeTypes extends Items
{
	onNew()
	{
		if ( this.state.newKey !== "" && this.props.graph._nodeTypes[ this.state.newKey ] === undefined )
		{
			this.props.graph.setNodeType( new TypeModel( this.state.newKey ) );
		}
	}
	
	get title()
	{
		return "node types";
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