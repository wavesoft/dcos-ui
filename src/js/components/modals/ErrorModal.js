import { FormattedMessage, injectIntl } from "react-intl";
import React from "react";

import { Modal } from "reactjs-components";

import ModalHeading from "../modals/ModalHeading";
import IntlContext from "../IntlContext";

var ErrorModal = React.createClass({
  displayName: "ErrorModal",

  propTypes: {
    onClose: React.PropTypes.func.isRequired,
    errorMsg: React.PropTypes.element
  },

  onClose() {
    this.props.onClose();
  },

  render() {
    if (!this.props.errorMsg) {
      return null;
    }
    const header = (
      <IntlContext intl={this.props.intl}>
        <ModalHeading>
          <FormattedMessage
            id="BkST3m1-z"
            defaultMessage={`Looks Like Something is Wrong`}
          />
        </ModalHeading>
      </IntlContext>
    );

    return (
      <Modal
        modalClass="modal"
        onClose={this.onClose}
        open={this.props.open}
        showHeader={true}
        header={header}
      >
        <IntlContext intl={this.props.intl}>
          {this.props.errorMsg}
        </IntlContext>
      </Modal>
    );
  }
});

module.exports = injectIntl(ErrorModal);
