import { FormattedMessage } from "react-intl";
import { Link } from "react-router";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import AlertPanel from "../components/AlertPanel";
import AlertPanelHeader from "../components/AlertPanelHeader";

const VirtualNetworkUtil = {
  getEmptyNetworkScreen() {
    return (
      <AlertPanel>
        <AlertPanelHeader>
          <FormattedMessage
            id="XXXX"
            defaultMessage={`Virtual network not found`}
          />
        </AlertPanelHeader>
        <p className="flush">
          <FormattedMessage
            id="XXXX"
            defaultMessage={`
          Could not find the requested virtual network. Go to
          `}
          />{" "}
          <Link to="/networking/networks">
            <FormattedMessage id="XXXX" defaultMessage={`Networks`} />
          </Link>
          {" "}<FormattedMessage
            id="XXXX"
            defaultMessage={`
          overview to see all virtual networks.
        `}
          />
        </p>
      </AlertPanel>
    );
  }
};

module.exports = VirtualNetworkUtil;
