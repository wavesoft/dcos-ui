import { injectIntl } from "react-intl";
import React from "react";

import Icon from "../components/Icon";

class CatalogPage extends React.Component {
  render() {
    return this.props.children;
  }
}
const comp = injectIntl(CatalogPage);
comp.routeConfig = {
  label: "Catalog",
  icon: <Icon id="packages-inverse" size="small" family="product" />,
  matches: /^\/catalog/
};

module.exports = comp;
