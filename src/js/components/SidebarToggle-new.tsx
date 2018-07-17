import * as React from "react";

import Icon from "../components/Icon";
import * as SidebarActions from "../events/SidebarActions";
import SidebarStore from "../stores/SidebarStore";

export default class SidebarToggle extends React.Component<{}, {}> {
  constructor() {
    super(...arguments);

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event: any) {
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
      <span className="header-bar-sidebar-toggle" title="Show/Hide Sidebar">
        <Icon
          onClick={this.handleToggle}
          className="header-bar-sidebar-toggle-icon header-bar-sidebar-toggle-icon-desktop"
          id="menu"
          size="mini"
          color="white"
        />
      </span>
    );
  }
}
