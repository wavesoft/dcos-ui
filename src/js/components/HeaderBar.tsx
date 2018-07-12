import * as React from "react";
import { HeaderBar as UIHeaderBar } from "ui-kit-stage/HeaderBar";
import SidebarToggle from "./SidebarToggle";

export default function HeaderBar() {
  // remove this to activate component
  // if (arguments) {
  //   return null;
  // }

  // TODO: show sidebar toggle also on big screen
  // TODO: prepare removal of mobile old sidebar toggle
  // TODO: style sidebar toggle for new position according to https://mesosphere.invisionapp.com/share/4GMFWQ17NPQ#/screens/304858417
  //       Dimensions: https://wiki.mesosphere.com/pages/viewpage.action?spaceKey=DCOS&title=Branding+in+UI#
  // TODO: check keyboard functionality

  return (
    <UIHeaderBar>
      <SidebarToggle />
      <span>logo component here</span>
      <span>user-menu component here</span>
      <span>cluster-menu component here</span>
    </UIHeaderBar>
  );
}
