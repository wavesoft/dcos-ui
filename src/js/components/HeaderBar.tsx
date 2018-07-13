import * as React from "react";
import { HeaderBar as UIHeaderBar } from "ui-kit-stage/HeaderBar";
import SidebarToggle from "#SRC/js/components/SidebarToggle-new";

export default function HeaderBar() {
  // remove this to activate component
  // if (arguments) {
  //   return null;
  // }

  return (
    <UIHeaderBar>
      <SidebarToggle />
      <div className="header-bar-logo-wrapper">
        <div className="header-bar-logo" />
      </div>
      <span>user-menu component here</span>
      <span>cluster-menu component here</span>
    </UIHeaderBar>
  );
}
