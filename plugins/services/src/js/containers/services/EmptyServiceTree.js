import { FormattedMessage } from "react-intl";
import React, { PropTypes } from "react";

import AlertPanel from "#SRC/js/components/AlertPanel";
import AlertPanelHeader from "#SRC/js/components/AlertPanelHeader";

const EmptyServiceTree = function({ onCreateGroup, onCreateService }) {
  const footer = (
    <div className="button-collection flush-bottom">
      <button className="button button-stroke" onClick={onCreateGroup}>
        <FormattedMessage
          id="XXXX"
          defaultMessage={`
        Create Group
      `}
        />
      </button>
      <button className="button button-success" onClick={onCreateService}>
        <FormattedMessage
          id="XXXX"
          defaultMessage={`
        Run a Service
      `}
        />
      </button>
    </div>
  );

  return (
    <AlertPanel>
      <AlertPanelHeader>
        <FormattedMessage id="XXXX" defaultMessage={`No running services`} />
      </AlertPanelHeader>
      <p className="tall">
        <FormattedMessage
          id="XXXX"
          defaultMessage={`
        Run a new service or create a new group to help organize your services.
      `}
        />
      </p>
      {footer}
    </AlertPanel>
  );
};

EmptyServiceTree.defaultProps = {
  onCreateGroup: () => {},
  onCreateService: () => {}
};

EmptyServiceTree.propTypes = {
  onCreateGroup: PropTypes.func,
  onCreateService: PropTypes.func
};

module.exports = EmptyServiceTree;
