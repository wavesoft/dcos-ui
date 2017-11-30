import { injectIntl } from "react-intl";
import React from "react";

import Icon from "../components/Icon";

class OrganizationPage extends React.Component {
  render() {
    return this.props.children;
  }
}
const comp = injectIntl(OrganizationPage);
comp.routeConfig = {
  label: "Organization",
  icon: <Icon id="users-inverse" size="small" family="product" />,
  matches: /^\/organization/
};

module.exports = comp;
