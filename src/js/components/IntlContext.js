import React from "react";
import { intlShape } from "react-intl";

class IntlContext extends React.Component {
  getChildContext() {
    return { intl: this.props.intl };
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
IntlContext.childContextTypes = {
  intl: intlShape.isRequired
};
IntlContext.propTypes = {
  intl: intlShape.isRequired
};

module.exports = IntlContext;
