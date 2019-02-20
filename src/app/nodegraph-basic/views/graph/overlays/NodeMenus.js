import React from "react";
import { observer } from "mobx-react";
import NodeMenusBase from "../../../../nodegraph/views/graph/overlays/NodeMenus";
import NodeMenu from "./NodeMenu";

class NodeMenus extends NodeMenusBase
{
	renderNodeMenu( tNode )
	{
		return (
			<NodeMenu key={ tNode._id } node={ tNode }/>
		);
	}
}

NodeMenus.propTypes = Object.assign( {}, NodeMenusBase.propTypes );

export default observer( NodeMenus );