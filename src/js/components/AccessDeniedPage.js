import { FormattedMessage } from "react-intl";
import React from "react";

import AuthStore from "../stores/AuthStore";
import AlertPanel from "./AlertPanel";
import AlertPanelHeader from "./AlertPanelHeader";
import Config from "../config/Config";
import MetadataStore from "../stores/MetadataStore";

const METHODS_TO_BIND = ["handleUserLogout"];

module.exports = class AccessDeniedPage extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  handleUserLogout() {
    AuthStore.logout();
  }

  getFooter() {
    return (
      <div className="button-collection flush-bottom">
        <button
          className="button button-primary"
          onClick={this.handleUserLogout}
        >
          Log out
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="application-wrapper">
        <div className="page">
          <div className="page-body-content vertical-center flex-item-grow-1">
            <AlertPanel>
              <AlertPanelHeader>
                <FormattedMessage id="XXXX" defaultMessage={`Access denied`} />
              </AlertPanelHeader>
              <p className="tall">
                <FormattedMessage
                  id="XXXX"
                  defaultMessage={`You do not have access to this service. Please contact your`}
                />
                {Config.productName}
                <FormattedMessage
                  id="XXXX"
                  defaultMessage={`administrator or see`}
                />
                <a
                  href={MetadataStore.buildDocsURI(
                    "/administration/id-and-access-mgt/"
                  )}
                  target="_blank"
                >
                  security documentation
                </a>
                <FormattedMessage
                  id="XXXX"
                  defaultMessage={`for more information.`}
                />
              </p>
              {this.getFooter()}
            </AlertPanel>
          </div>
        </div>
      </div>
    );
  }
};
