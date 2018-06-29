import { Confirm } from "reactjs-components";
import mixin from "reactjs-mixin";
import PropTypes from "prop-types";
import React from "react";
import { StoreMixin } from "mesosphere-shared-reactjs";

import ModalHeading from "#SRC/js/components/modals/ModalHeading";

class JobStopRunModal extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.handleButtonConfirm = this.handleButtonConfirm.bind(this);
  }

  handleButtonConfirm() {
    const { selectedItems, jobID } = this.props;
    if (selectedItems.length === 1) {
      this.props.action(jobID, selectedItems[0]);
    }
  }

  getContentHeader(selectedItems, selectedItemsLength) {
    let headerContent = ` ${selectedItemsLength} Job Runs`;
    if (selectedItemsLength === 1) {
      headerContent = "this";
    }

    return (
      <ModalHeading key="confirmHeader">
        {`Are you sure you want to stop ${headerContent}?`}
      </ModalHeading>
    );
  }

  getConfirmTextBody(selectedItems, selectedItemsLength) {
    let bodyText;

    if (selectedItemsLength === 1) {
      bodyText = `the job run with id ${selectedItems[0]}`;
    } else {
      bodyText = "the selected job runs";
    }

    return <span key="confirmText">You are about to stop {bodyText}.</span>;
  }

  getModalContents() {
    const { selectedItems } = this.props;
    const selectedItemsLength = selectedItems.length;

    return (
      <div className="text-align-center">
        {this.getConfirmTextBody(selectedItems, selectedItemsLength)}
      </div>
    );
  }

  render() {
    const { onClose, open, selectedItems } = this.props;
    let rightButtonText = "Stop Job Run";
    const selectedItemsLength = selectedItems.length;

    if (selectedItems.length > 1) {
      rightButtonText = "Stop Job Runs";
    }

    return (
      <Confirm
        closeByBackdropClick={true}
        // disabled={this.props.pendingRequest}
        header={this.getContentHeader(selectedItems, selectedItemsLength)}
        open={open}
        onClose={onClose}
        leftButtonText="Cancel"
        leftButtonCallback={onClose}
        leftButtonClassName="button button-primary-link"
        rightButtonText={rightButtonText}
        rightButtonClassName="button button-danger"
        rightButtonCallback={this.handleButtonConfirm}
        showHeader={true}
      >
        {this.getModalContents()}
      </Confirm>
    );
  }
}

JobStopRunModal.defaultProps = {
  onSuccess() {}
};

JobStopRunModal.propTypes = {
  jobID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  selectedItems: PropTypes.array.isRequired
};

module.exports = JobStopRunModal;
