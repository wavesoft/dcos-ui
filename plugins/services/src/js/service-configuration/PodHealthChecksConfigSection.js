import React from "react";

import ConfigurationMapHeading
  from "#SRC/js/components/ConfigurationMapHeading";
import ConfigurationMapSection
  from "#SRC/js/components/ConfigurationMapSection";

import ConfigurationMapTable from "../components/ConfigurationMapTable";
import ConfigurationMapDurationValue
  from "../components/ConfigurationMapDurationValue";
import { getContainerNameWithIcon } from "../utils/ServiceConfigDisplayUtil";
import ConfigurationMapValueWithDefault
  from "../components/ConfigurationMapValueWithDefault";

const COMMON_COLUMNS = [
  {
    heading: formatMessage({ id: "XXXX", defaultMessage: "Grace Period" }),
    prop: "gracePeriod",
    render(prop, row) {
      return <ConfigurationMapDurationValue units="sec" value={row[prop]} />;
    }
  },
  {
    heading: formatMessage({ id: "XXXX", defaultMessage: "Interval" }),
    prop: "interval",
    render(prop, row) {
      return <ConfigurationMapDurationValue units="sec" value={row[prop]} />;
    }
  },
  {
    heading: formatMessage({ id: "XXXX", defaultMessage: "Timeout" }),
    prop: "timeout",
    render(prop, row) {
      return <ConfigurationMapDurationValue units="sec" value={row[prop]} />;
    }
  },
  {
    heading: formatMessage({ id: "XXXX", defaultMessage: "Max Failures" }),
    prop: "maxFailures"
  },
  {
    heading: formatMessage({ id: "XXXX", defaultMessage: "Container" }),
    prop: "container"
  }
];

class PodHealthChecksConfigSection extends React.Component {
  getCommandColumns() {
    return [
      {
        heading: formatMessage({ id: "XXXX", defaultMessage: "Command" }),
        prop: "command"
      }
    ].concat(COMMON_COLUMNS);
  }

  getDefaultEndpointsColumns() {
    return {
      hideIfEmpty: true,
      render(prop, row) {
        // We use a default <Value/> renderer in order to render
        // all elements as <Div/>s. Otherwise the boolean's look
        // funny.
        return <ConfigurationMapValueWithDefault value={row[prop]} />;
      }
    };
  }

  getEndpointsColumns() {
    return [
      {
        heading: formatMessage({
          id: "XXXX",
          defaultMessage: "Service Endpoint"
        }),
        prop: "endpoint"
      },
      {
        heading: formatMessage({ id: "XXXX", defaultMessage: "Proto" }),
        prop: "protocol"
      },
      {
        heading: formatMessage({ id: "XXXX", defaultMessage: "Path" }),
        prop: "path"
      }
    ].concat(COMMON_COLUMNS);
  }

  render() {
    const { onEditClick } = this.props;
    const { containers = [] } = this.props.appConfig;
    const healthChecks = containers.reduce(
      (memo, container) => {
        const { healthCheck } = container;

        if (!healthCheck) {
          return memo;
        }

        const spec = {
          interval: healthCheck.intervalSeconds,
          gracePeriod: healthCheck.gracePeriodSeconds,
          maxFailures: healthCheck.maxConsecutiveFailures,
          timeout: healthCheck.timeoutSeconds,
          container: getContainerNameWithIcon(container)
        };

        if (healthCheck.exec != null) {
          spec.command = healthCheck.exec.command.shell;
          if (healthCheck.exec.command.argv) {
            spec.command = healthCheck.exec.command.argv.join(" ");
          }

          memo.command.push(spec);
        }

        if (healthCheck.http != null) {
          spec.endpoint = healthCheck.http.endpoint;
          spec.path = healthCheck.http.path;
          spec.protocol = healthCheck.http.scheme || "http";
          memo.endpoints.push(spec);
        }

        if (healthCheck.tcp != null) {
          spec.endpoint = healthCheck.tcp.endpoint;
          spec.protocol = "tcp";
          memo.endpoints.push(spec);
        }

        return memo;
      },
      { endpoints: [], command: [] }
    );

    if (!healthChecks.endpoints.length && !healthChecks.command.length) {
      return null;
    }

    return (
      <div>
        <ConfigurationMapHeading level={1}>
          <FormattedMessage
            id="XXXX"
            defaultMessage={`
          Health Checks
        `}
          />
        </ConfigurationMapHeading>

        {healthChecks.endpoints.length !== 0 &&
          <div>
            <ConfigurationMapHeading level={2}>
              <FormattedMessage
                id="XXXX"
                defaultMessage={`
              Service Endpoint Health Checks
            `}
              />
            </ConfigurationMapHeading>
            <ConfigurationMapSection key="pod-general-section">
              <ConfigurationMapTable
                columnDefaults={this.getDefaultEndpointsColumns()}
                columns={this.getEndpointsColumns()}
                data={healthChecks.endpoints}
                onEditClick={onEditClick}
                tabViewID="multihealthChecks"
              />
            </ConfigurationMapSection>
          </div>}

        {healthChecks.command.length !== 0 &&
          <div>
            <ConfigurationMapHeading level={2}>
              <FormattedMessage
                id="XXXX"
                defaultMessage={`
              Command Health Checks
            `}
              />
            </ConfigurationMapHeading>
            <ConfigurationMapSection key="pod-general-section">
              <ConfigurationMapTable
                columnDefaults={{ hideIfEmpty: true }}
                columns={this.getCommandColumns()}
                data={healthChecks.command}
                onEditClick={onEditClick}
                tabViewID="multihealthChecks"
              />
            </ConfigurationMapSection>
          </div>}

      </div>
    );
  }
}

PodHealthChecksConfigSection.defaultProps = {
  appConfig: {}
};

PodHealthChecksConfigSection.propTypes = {
  appConfig: React.PropTypes.object,
  onEditClick: React.PropTypes.func
};

module.exports = PodHealthChecksConfigSection;
