import { injectIntl } from "react-intl";
import React from "react";
import { routerShape } from "react-router";

import Icon from "../components/Icon";
import SidebarActions from "../events/SidebarActions";

class JobsPage extends React.Component {
  render() {
    return this.props.children;
  }
}

JobsPage.contextTypes = {
  router: routerShape
};

JobsPage.willTransitionTo = function() {
  SidebarActions.close();
};
const comp = injectIntl(JobsPage);
comp.routeConfig = {
  label: "Jobs",
  icon: <Icon id="jobs-inverse" size="small" family="product" />,
  matches: /^\/jobs/
};

module.exports = comp;
