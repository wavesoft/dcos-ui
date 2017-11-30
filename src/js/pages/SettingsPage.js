import { formatMessage } from "react-intl";
import React from "react";

import Icon from "../components/Icon";

class SettingsPage extends React.Component {
  render() {
    return this.props.children;
  }
}

SettingsPage.routeConfig = {
  label: formatMessage({ id: "XXXX", defaultMessage: "Settings" }),
  icon: <Icon id="gear-inverse" size="small" family="product" />,
  matches: /^\/settings/
};

module.exports = SettingsPage;
