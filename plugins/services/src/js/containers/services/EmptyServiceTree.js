import { FormattedMessage } from "react-intl";
import React, { PropTypes } from "react";

import AlertPanel from "#SRC/js/components/AlertPanel";
import AlertPanelHeader from "#SRC/js/components/AlertPanelHeader";

const EmptyServiceTree = function({ onCreateGroup, onCreateService }) {
  const footer = (
    <div className="button-collection flush-bottom">
      <button className="button button-stroke" onClick={onCreateGroup}>
        <FormattedMessage id="SJyQah271bG" defaultMessage={`Create Group`} />
      </button>
      <button className="button button-success" onClick={onCreateService}>
        <FormattedMessage id="SJeQ63nQkWf" defaultMessage={`Run a Service`} />
      </button>
    </div>
  );

  return (
    <AlertPanel>
      <AlertPanelHeader>
        <FormattedMessage
          id="BkWXahn71Wz"
          defaultMessage={`No running services`}
        />
      </AlertPanelHeader>
      <p className="tall">
        <FormattedMessage
          id="S1zXT22QJ-z"
          defaultMessage={`Run a new service or create a new group to help organize your services.`}
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
