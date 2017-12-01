import { FormattedMessage } from "react-intl";
import React from "react";

import { findNestedPropertyInObject } from "#SRC/js/utils/Util";
import ConfigurationMapHeading
  from "#SRC/js/components/ConfigurationMapHeading";
import ConfigurationMapLabel from "#SRC/js/components/ConfigurationMapLabel";
import ConfigurationMapRow from "#SRC/js/components/ConfigurationMapRow";
import ConfigurationMapSection
  from "#SRC/js/components/ConfigurationMapSection";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import Units from "#SRC/js/utils/Units";

import ConfigurationMapEditAction
  from "../components/ConfigurationMapEditAction";
import ConfigurationMapValueWithDefault
  from "../components/ConfigurationMapValueWithDefault";
import DurationValue from "../components/ConfigurationMapDurationValue";

/**
 * Summarize the resources of every container, including the containers and
 * their values in a comma-separated list after the value.
 *
 * @param {String} resource - The name of the resource in the field
 * @param {Object} appConfig - The application configuration
 * @returns {Node|String} Returns the contents to be rendered
 */
function getContainerResourceSummary(resource, { containers = [] }) {
  const summary = containers.reduce(
    (memo, { name, resources = {} }) => {
      const value = resources[resource];
      if (value) {
        memo.value += value;
        memo.parts.push(`${Units.formatResource(resource, value)} ${name}`);
      }

      return memo;
    },
    { value: 0, parts: [] }
  );

  if (!summary.value) {
    return (
      <em>
        <FormattedMessage id="H1mge62Q1-M" defaultMessage={`Not Supported`} />
      </em>
    );
  }

  return (
    `${Units.formatResource(resource, summary.value)} ` +
    `(${summary.parts.join(", ")})`
  );
}

/**
 * Get the number of instances defined in the scaling policy,
 * including additional information if needed (ex. maxInstances)
 *
 * @param {Object} appConfig - The application configuration
 * @returns {String|null} Returns the expression to render or null if unknown
 *                        scaling policy
 */
function getInstances(appConfig) {
  if (appConfig.scaling && appConfig.scaling.kind === "fixed") {
    let expr = `${appConfig.scaling.instances}`;
    if (appConfig.scaling.maxInstances) {
      expr += ` (Max ${appConfig.scaling.maxInstances})`;
    }

    return expr;
  }

  return null;
}

const PodGeneralConfigSection = ({ appConfig, onEditClick }) => {
  const fields = {
    instances: getInstances(appConfig),
    backoff: findNestedPropertyInObject(
      appConfig,
      "scheduling.backoff.backoff"
    ),
    backoffFactor: findNestedPropertyInObject(
      appConfig,
      "scheduling.backoff.backoffFactor"
    ),
    maxLaunchDelay: findNestedPropertyInObject(
      appConfig,
      "scheduling.backoff.maxLaunchDelay"
    ),
    minimumHealthCapacity: findNestedPropertyInObject(
      appConfig,
      "scheduling.upgrade.minimumHealthCapacity"
    ),
    maximumOverCapacity: findNestedPropertyInObject(
      appConfig,
      "scheduling.upgrade.maximumOverCapacity"
    )
  };

  return (
    <div>
      <ConfigurationMapHeading level={1}>
        <FormattedMessage id="SyVglT37ybz" defaultMessage={`General`} />
      </ConfigurationMapHeading>
      <ConfigurationMapSection key="pod-general-section">
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="ByHlea3mJWz" defaultMessage={`Service ID`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue value={appConfig.id} />
          <ConfigurationMapEditAction
            onEditClick={onEditClick}
            tabViewID="services"
          />
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="ByIxla3X1-z" defaultMessage={`Instances`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValueWithDefault value={fields.instances} />
          <ConfigurationMapEditAction
            onEditClick={onEditClick}
            tabViewID="services"
          />
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="ryDxlp3XkWG" defaultMessage={`CPU`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {getContainerResourceSummary("cpus", appConfig)}
          </ConfigurationMapValue>
          <ConfigurationMapEditAction
            onEditClick={onEditClick}
            tabViewID="services"
          />
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="SydeeT2Xkbf" defaultMessage={`Memory`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {getContainerResourceSummary("mem", appConfig)}
          </ConfigurationMapValue>
          <ConfigurationMapEditAction
            onEditClick={onEditClick}
            tabViewID="services"
          />
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="SyFgxp2QyWM" defaultMessage={`Disk`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {getContainerResourceSummary("disk", appConfig)}
          </ConfigurationMapValue>
          <ConfigurationMapEditAction
            onEditClick={onEditClick}
            tabViewID="services"
          />
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="HkcxeTnm1-M" defaultMessage={`GPU`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {getContainerResourceSummary("gpu", appConfig)}
          </ConfigurationMapValue>
          <ConfigurationMapEditAction
            onEditClick={onEditClick}
            tabViewID="services"
          />
        </ConfigurationMapRow>
        {Boolean(fields.backoff) &&
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage id="rkjglp3myWM" defaultMessage={`Backoff`} />
            </ConfigurationMapLabel>
            <DurationValue units="sec" value={fields.backoff} />
            <ConfigurationMapEditAction
              onEditClick={onEditClick}
              tabViewID="services"
            />
          </ConfigurationMapRow>}
        {Boolean(fields.backoffFactor) &&
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="Hk3lgp2XJbM"
                defaultMessage={`Backoff Factor`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue value={fields.backoffFactor} />
            <ConfigurationMapEditAction
              onEditClick={onEditClick}
              tabViewID="services"
            />
          </ConfigurationMapRow>}
        {Boolean(fields.maxLaunchDelay) &&
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="SyaxlT3XkWM"
                defaultMessage={`Backoff Max Launch Delay`}
              />
            </ConfigurationMapLabel>
            <DurationValue units="sec" value={fields.maxLaunchDelay} />
            <ConfigurationMapEditAction
              onEditClick={onEditClick}
              tabViewID="services"
            />
          </ConfigurationMapRow>}
        {Boolean(fields.minimumHealthCapacity) &&
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="HJAgxa2m1-M"
                defaultMessage={`Upgrade Min Health Capacity`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue value={fields.minimumHealthCapacity} />
            <ConfigurationMapEditAction
              onEditClick={onEditClick}
              tabViewID="services"
            />
          </ConfigurationMapRow>}
        {Boolean(fields.maximumOverCapacity) &&
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="BJJ-xa2QkbM"
                defaultMessage={`Upgrade Max Overcapacity`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue value={fields.maximumOverCapacity} />
            <ConfigurationMapEditAction
              onEditClick={onEditClick}
              tabViewID="services"
            />
          </ConfigurationMapRow>}
      </ConfigurationMapSection>
    </div>
  );
};

PodGeneralConfigSection.propTypes = {
  onEditClick: React.PropTypes.func
};

module.exports = PodGeneralConfigSection;
