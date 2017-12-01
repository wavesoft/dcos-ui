import { FormattedMessage, injectIntl } from "react-intl";
import { Modal } from "reactjs-components";
import React from "react";

import ClickToSelect from "../ClickToSelect";
import Config from "../../config/Config";
import ModalHeading from "../modals/ModalHeading";
import IntlContext from "../IntlContext";

var VersionsModal = React.createClass({
  displayName: "VersionsModal",

  propTypes: {
    onClose: React.PropTypes.func.isRequired,
    versionDump: React.PropTypes.object.isRequired
  },

  onClose() {
    this.props.onClose();
  },

  getContent() {
    var string = JSON.stringify(this.props.versionDump, null, 2);

    return <pre className="flush-bottom">{string}</pre>;
  },

  render() {
    const header = (
      <ModalHeading>
        <IntlContext intl={this.props.intl}>
          {Config.productName}
          <FormattedMessage id="XXXX" defaultMessage={`Info`} />
        </IntlContext>
      </ModalHeading>
    );

    return (
      <Modal
        onClose={this.onClose}
        open={this.props.open}
        showHeader={true}
        header={header}
        size="large"
      >
        <ClickToSelect>
          {this.getContent()}
        </ClickToSelect>
      </Modal>
    );
  }
});

module.exports = injectIntl(VersionsModal);
