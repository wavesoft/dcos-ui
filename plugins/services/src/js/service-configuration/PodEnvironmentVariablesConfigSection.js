import { FormattedMessage, injectIntl } from "react-intl";
import React from "react";

import ConfigurationMapHeading
  from "#SRC/js/components/ConfigurationMapHeading";
import ConfigurationMapSection
  from "#SRC/js/components/ConfigurationMapSection";

import {
  getSharedIconWithLabel,
  getContainerNameWithIcon
} from "../utils/ServiceConfigDisplayUtil";
import ConfigurationMapTable from "../components/ConfigurationMapTable";

const PodEnvironmentVariablesConfigSection = ({ appConfig, onEditClick }) => {
  const { environment = {}, containers = [] } = appConfig;

  if (!environment || !containers) {
    return <noscript />;
  }

  let combinedEnv = Object.keys(environment)
    .filter(function(key) {
      return typeof environment[key] === "string";
    })
    .reduce((memo, key) => {
      memo.push({
        key: <code>{key}</code>,
        value: environment[key],
        container: getSharedIconWithLabel()
      });

      return memo;
    }, []);

  combinedEnv = containers.reduce((memo, container) => {
    const { environment = {} } = container;

    return Object.keys(environment).reduce((cvMemo, key) => {
      cvMemo.push({
        key: <code>{key}</code>,
        value: environment[key],
        container: getContainerNameWithIcon(container)
      });

      return cvMemo;
    }, memo);
  }, combinedEnv);

  if (!combinedEnv.length) {
    return <noscript />;
  }

  const columns = [
    {
      heading: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Key"
      }),
      prop: "key"
    },
    {
      heading: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Value"
      }),
      prop: "value"
    },
    {
      heading: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Container"
      }),
      prop: "container"
    }
  ];

  return (
    <div>
      <ConfigurationMapHeading level={1}>
        <FormattedMessage id="XXXX" defaultMessage={`Environment Variables`} />
      </ConfigurationMapHeading>
      <ConfigurationMapSection key="pod-general-section">
        <ConfigurationMapTable
          columnDefaults={{ hideIfEmpty: true }}
          columns={columns}
          data={combinedEnv}
          onEditClick={onEditClick}
          tabViewID="multienvironment"
        />
      </ConfigurationMapSection>
    </div>
  );
};

PodEnvironmentVariablesConfigSection.propTypes = {
  onEditClick: React.PropTypes.func
};

module.exports = injectIntl(PodEnvironmentVariablesConfigSection);
