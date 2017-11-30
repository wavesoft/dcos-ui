import { injectIntl } from "react-intl";
import React from "react";

import Icon from "../components/Icon";

class ComponentsPage extends React.Component {
  render() {
    return this.props.children;
  }
}
const comp = injectIntl(ComponentsPage);
comp.routeConfig = {
  label: "Components",
  icon: <Icon id="components-inverse" size="small" family="product" />,
  matches: /^\/components/
};

module.exports = comp;
