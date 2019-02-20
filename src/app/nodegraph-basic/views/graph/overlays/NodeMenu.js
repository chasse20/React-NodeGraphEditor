import { observer } from "mobx-react";
import NodeMenuBase from "../../../../nodegraph/views/graph/overlays/NodeMenu";

class NodeMenu extends NodeMenuBase
{
	get radius()
	{
		return this.props.node._type.radius + 30;
	}
}

NodeMenu.propTypes = Object.assign( {}, NodeMenuBase.propTypes );

export default observer( NodeMenu );