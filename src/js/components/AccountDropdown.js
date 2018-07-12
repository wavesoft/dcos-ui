import { Dropdown } from "reactjs-components";
import React from "react";
import PropTypes from "prop-types";
import AccountDropdownTrigger from "./AccountDropdownTrigger";

class AccountDropdown extends React.Component {
  getMenuItems() {
    return this.props.menuItems;
  }

  getTrigger() {
    const { userName } = this.props;

    return <AccountDropdownTrigger primaryContent={userName} />;
  }

  handleItemSelection(item) {
    if (item.onClick) {
      item.onClick();
    }
  }

  render() {
    const { willAnchorRight } = this.props;

    return (
      <Dropdown
        trigger={this.getTrigger()}
        dropdownMenuClassName="user-account-dropdown-menu dropdown-menu header-bar-dropdown-menu"
        dropdownMenuListClassName="user-account-dropdown-list dropdown-menu-list"
        items={this.getMenuItems()}
        anchorRight={willAnchorRight}
        onItemSelection={this.handleItemSelection}
        persistentID="dropdown-trigger"
        transition={true}
      />
    );
  }
}

AccountDropdown.propTypes = {
  userName: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  willAnchorRight: PropTypes.bool
};

module.exports = AccountDropdown;
