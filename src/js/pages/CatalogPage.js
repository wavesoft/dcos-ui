import { injectIntl } from "react-intl";
import React from "react";

import Icon from "../components/Icon";

class CatalogPage extends React.Component {
  render() {
    return this.props.children;
  }
}

CatalogPage.routeConfig = {
  label: this.props.intl.formatMessage({
    id: "XXXX",
    defaultMessage: "Catalog"
  }),
  icon: <Icon id="packages-inverse" size="small" family="product" />,
  matches: /^\/catalog/
};

module.exports = injectIntl(CatalogPage);
