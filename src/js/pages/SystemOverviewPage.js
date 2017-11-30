import { injectIntl } from "react-intl";
import React from "react";

import Icon from "../components/Icon";

class SystemOverviewPage extends React.Component {
  render() {
    return this.props.children;
  }
}

SystemOverviewPage.routeConfig = {
  label: this.props.intl.formatMessage({
    id: "XXXX",
    defaultMessage: "Overview"
  }),
  icon: <Icon id="cluster-inverse" size="small" family="product" />,
  matches: /^\/overview/
};

module.exports = injectIntl(SystemOverviewPage);
