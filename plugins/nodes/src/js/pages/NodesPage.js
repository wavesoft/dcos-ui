import { injectIntl } from "react-intl";
import React from "react";

import Icon from "#SRC/js/components/Icon";

class NodesPage extends React.Component {
  render() {
    return this.props.children;
  }
}
const comp = injectIntl(NodesPage);
comp.routeConfig = {
  label: "Nodes",
  icon: <Icon id="servers-inverse" size="small" family="product" />,
  matches: /^\/nodes/
};

module.exports = comp;
