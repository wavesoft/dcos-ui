import { FormattedMessage, injectIntl } from "react-intl";
import React from "react";

import ConfigurationMapHeading
  from "#SRC/js/components/ConfigurationMapHeading";

import ConfigurationMapBooleanValue
  from "../components/ConfigurationMapBooleanValue";
import ConfigurationMapTable from "../components/ConfigurationMapTable";

const BOOLEAN_OPTIONS = {
  truthy: "TRUE",
  falsy: "FALSE"
};

class PodContainerArtifactsConfigSection extends React.Component {
  getColumns() {
    return [
      {
        heading: this.props.intl.formatMessage({
          id: "ryelThXkbz",
          defaultMessage: "Artifact URI"
        }),
        prop: "uri"
      },
      {
        heading: this.props.intl.formatMessage({
          id: "rkbeTnXyWf",
          defaultMessage: "Executable"
        }),
        prop: "executable",
        render(prop, row) {
          return (
            <ConfigurationMapBooleanValue
              options={BOOLEAN_OPTIONS}
              value={row[prop]}
            />
          );
        }
      },
      {
        heading: this.props.intl.formatMessage({
          id: "ByGeT2QyZz",
          defaultMessage: "Extract"
        }),
        prop: "extract",
        render(prop, row) {
          return (
            <ConfigurationMapBooleanValue
              options={BOOLEAN_OPTIONS}
              value={row[prop]}
            />
          );
        }
      },
      {
        heading: this.props.intl.formatMessage({
          id: "S1Qxa27y-G",
          defaultMessage: "Cache"
        }),
        prop: "cache",
        render(prop, row) {
          return (
            <ConfigurationMapBooleanValue
              options={BOOLEAN_OPTIONS}
              value={row[prop]}
            />
          );
        }
      },
      {
        heading: this.props.intl.formatMessage({
          id: "rJElT3XJbG",
          defaultMessage: "Destination Path"
        }),
        prop: "destPath"
      }
    ];
  }

  render() {
    const { artifacts, index, onEditClick } = this.props;
    let tabViewID = "services";
    if (index != null) {
      tabViewID = `container${index}`;
    }

    if (!artifacts || !artifacts.length) {
      return <noscript />;
    }

    return (
      <div>
        <ConfigurationMapHeading level={3}>
          <FormattedMessage
            id="r1e63X1bG"
            defaultMessage={`Container Artifacts`}
          />
        </ConfigurationMapHeading>
        <ConfigurationMapTable
          columnDefaults={{ hideIfEmpty: true }}
          columns={this.getColumns()}
          data={artifacts}
          onEditClick={onEditClick}
          tabViewID={tabViewID}
        />
      </div>
    );
  }
}

PodContainerArtifactsConfigSection.defaultProps = {
  artifacts: []
};

PodContainerArtifactsConfigSection.propTypes = {
  artifacts: React.PropTypes.array,
  index: React.PropTypes.number,
  onEditClick: React.PropTypes.func
};

module.exports = injectIntl(PodContainerArtifactsConfigSection);
