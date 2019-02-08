import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import GraphModel from "../../../models/Graph";
import TypeModel from "../../../models/TypeNode";
import NodeBase from "../../../../nodegraph/views/interface/menu-sub-types-node/Node";
import NodeType from "../../../../nodegraph/views/interface/menu-item-nodetype/NodeType";

class Node extends NodeBase
{	
	createType( tName )
	{
		return new TypeModel( tName );
	}
	
	renderItems()
	{
		return (
			<React.Fragment>
				{
					Object.keys( this.props.graph._nodeTypes ).map(
						( tKey ) =>
						(
							<NodeType key={ tKey } graph={ this.props.graph } model={ this.props.graph._nodeTypes[ tKey ] }/>
						)
					)
				}
			</React.Fragment>
		);
	}
}

Node.propTypes = Object.assign(
	{},
	NodeBase.propTypes,
	{
		graph: PropTypes.instanceOf( GraphModel ).isRequired
	}
);

export default observer( Node );