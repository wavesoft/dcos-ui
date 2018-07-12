import * as React from "react";
import AuthStore from "#SRC/js/stores/AuthStore";

import { HeaderBar as UIHeaderBar } from "ui-kit-stage/HeaderBar";

import ClusterDropdown from "./ClusterDropdown";
import AccountDropdown from "./AccountDropdown";

function getUserAccountDropdown() {
  const userLabel = AuthStore.getUserLabel();
  const menuItems = [
    {
      className: "dropdown-menu-section-header",
      html: <label>{userLabel}</label>,
      id: "header-user-label",
      selectable: false
    },
    {
      html: "Sign Out",
      id: "sign-out",
      onClick: AuthStore.logout
    }
  ];

  return (
    <AccountDropdown
      menuItems={menuItems}
      userName={userLabel}
      willAnchorRight={false}
    />
  );
}

export default function HeaderBar() {
  // remove this to activate component
  // if (arguments) {
  //   return null;
  // }

  const userAccountDropdown = getUserAccountDropdown();

  return (
    <UIHeaderBar>
      {/* <span>toggle component here</span> */}
      <div className="header-bar-logo-wrapper">
        <div className="header-bar-logo" />
      </div>
      <div className="header-bar-dropdown-wrapper">
        {userAccountDropdown}
        <ClusterDropdown />
      </div>
    </UIHeaderBar>
  );
}
