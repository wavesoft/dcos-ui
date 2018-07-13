import * as React from "react";

import Icon from "../components/Icon";
import * as SidebarActions from "../events/SidebarActions";
import SidebarStore from "../stores/SidebarStore";

export default class SidebarToggle extends React.Component<{}, {}> {
  constructor() {
    super(...arguments);

    this.handleDesktopToggle = this.handleDesktopToggle.bind(this);
    this.handleMobileToggle = this.handleMobileToggle.bind(this);
  }

  handleDesktopToggle(event: any) {
    event.preventDefault();
    event.stopPropagation();

    window.requestAnimationFrame(() => {
      if (SidebarStore.get("isDocked")) {
        SidebarActions.undock();
      } else {
        SidebarActions.dock();
      }
    });
  }

  handleMobileToggle(event: any) {
    event.preventDefault();
    event.stopPropagation();

    window.requestAnimationFrame(() => {
      if (SidebarStore.get("isVisible")) {
        SidebarActions.close();
      } else {
        SidebarActions.open();
      }
    });
  }

  render() {
    return (
      <div className="header-bar-sidebar-toggle">
        <Icon
          onClick={this.handleDesktopToggle}
          className="header-bar-sidebar-toggle-icon header-bar-sidebar-toggle-icon-desktop"
          id="menu"
          size="mini"
          color="white"
        />
        <Icon
          onClick={this.handleMobileToggle}
          className="header-bar-sidebar-toggle-icon header-bar-sidebar-toggle-icon-mobile"
          id="menu"
          size="mini"
          color="white"
        />
        <span className="header-bar-sidebar-toggle-label">
          Show/Hide Sidebar
        </span>
      </div>
    );
  }
}
