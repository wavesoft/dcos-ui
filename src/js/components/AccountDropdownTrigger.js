import mixin from "reactjs-mixin";
import PropTypes from "prop-types";
import React from "react";
import { StoreMixin } from "mesosphere-shared-reactjs";

class AccountDropdownTrigger extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: "metadata",
        events: ["success"],
        listenAlways: false
      }
    ];
  }

  componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

  render() {
    const { primaryContent, onTrigger } = this.props;

    return (
      <a className="header-bar-dropdown" onClick={onTrigger}>
        <span className="header-bar-dropdown-content text-overflow">
          {primaryContent}
        </span>
      </a>
    );
  }
}

AccountDropdownTrigger.propTypes = {
  primaryContent: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
  onTrigger: PropTypes.func
};

module.exports = AccountDropdownTrigger;
