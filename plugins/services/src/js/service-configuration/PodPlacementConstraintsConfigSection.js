import { FormattedMessage, injectIntl } from "react-intl";
import React from "react";

import { findNestedPropertyInObject } from "#SRC/js/utils/Util";
import ConfigurationMapHeading
  from "#SRC/js/components/ConfigurationMapHeading";
import ConfigurationMapSection
  from "#SRC/js/components/ConfigurationMapSection";

import ConfigurationMapTable from "../components/ConfigurationMapTable";
import PlacementConstraintsUtil from "../utils/PlacementConstraintsUtil";

class PodPlacementConstraintsConfigSection extends React.Component {
  getColumns() {
    return [
      {
        heading: this.props.intl.formatMessage({
          id: "rJoMeT3QkbG",
          defaultMessage: "Field Name"
        }),
        prop: "fieldName"
      },
      {
        heading: this.props.intl.formatMessage({
          id: "ry2Mgp3myZz",
          defaultMessage: "Operator"
        }),
        prop: "operator"
      },
      {
        heading: this.props.intl.formatMessage({
          id: "Sy6GxT2Q1Zf",
          defaultMessage: "Value"
        }),
        prop: "value"
      }
    ];
  }

  getConstraints() {
    const constraints = findNestedPropertyInObject(
      this.props.appConfig,
      "scheduling.placement.constraints"
    ) || [];

    return constraints.map(function({ fieldName, operator, value }) {
      if (PlacementConstraintsUtil.requiresEmptyValue(operator)) {
        value = (
          <em>
            <FormattedMessage
              id="SyFze6nmkWz"
              defaultMessage={`Not Applicable`}
            />
          </em>
        );
      }

      return { fieldName, operator, value };
    });
  }

  render() {
    const { onEditClick } = this.props;
    const constraints = this.getConstraints();
    // Since we are stateless component we will need to return something for react
    // so we are using the `<noscript>` tag as placeholder.
    if (!constraints.length) {
      return <noscript />;
    }

    return (
      <div>
        <ConfigurationMapHeading level={3}>
          <FormattedMessage
            id="H1cfephQJZG"
            defaultMessage={`Placement Constraints`}
          />
        </ConfigurationMapHeading>
        <ConfigurationMapSection>
          <ConfigurationMapTable
            columns={this.getColumns()}
            data={constraints}
            onEditClick={onEditClick}
            tabViewID="services"
          />
        </ConfigurationMapSection>
      </div>
    );
  }
}

PodPlacementConstraintsConfigSection.defaultProps = {
  appConfig: {}
};

PodPlacementConstraintsConfigSection.propTypes = {
  appConfig: React.PropTypes.object,
  onEditClick: React.PropTypes.func
};

module.exports = injectIntl(PodPlacementConstraintsConfigSection);
