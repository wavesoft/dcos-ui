import { FormattedMessage } from "react-intl";
import React from "react";

import DCOSStore from "#SRC/js/stores/DCOSStore";
import ConfigurationMapHeading
  from "#SRC/js/components/ConfigurationMapHeading";
import ConfigurationMapLabel from "#SRC/js/components/ConfigurationMapLabel";
import ConfigurationMapRow from "#SRC/js/components/ConfigurationMapRow";
import ConfigurationMapSection
  from "#SRC/js/components/ConfigurationMapSection";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import TaskStates from "../constants/TaskStates";

class MarathonTaskDetailsList extends React.Component {
  getTaskPorts(task) {
    const { ports } = task;
    if (!ports || !ports.length) {
      return "None";
    }

    return ports.join(", ");
  }

  getTaskStatus(task) {
    if (task == null || task.state == null) {
      return "Unknown";
    }

    return TaskStates[task.state].displayName;
  }

  getTimeField(time) {
    let timeString = "Never";

    if (time != null) {
      timeString = new Date(time).toLocaleString();
    }

    return (
      <time dateTime={time} title={time}>
        {timeString}
      </time>
    );
  }

  getMarathonTaskDetails(task) {
    if (task == null) {
      return null;
    }

    return (
      <ConfigurationMapSection>
        <ConfigurationMapHeading>
          <FormattedMessage
            id="XXXX"
            defaultMessage={`Marathon Task Configuration`}
          />
        </ConfigurationMapHeading>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="XXXX" defaultMessage={`Host`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {task.host}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="XXXX" defaultMessage={`Ports`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTaskPorts(task)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="XXXX" defaultMessage={`Status`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTaskStatus(task)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="XXXX" defaultMessage={`Staged at`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.stagedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="XXXX" defaultMessage={`Started at`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.startedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="XXXX" defaultMessage={`Version`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {task.version}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getMarathonTaskHealthCheckResults(task) {
    if (task == null || task.healthCheckResults == null) {
      return null;
    }

    return task.healthCheckResults.map((result, i) => {
      let consecutiveFailures = result.consecutiveFailures;
      let alive = "Yes";

      if (consecutiveFailures == null) {
        consecutiveFailures = "None";
      }

      if (!result.alive) {
        alive = "No";
      }

      return (
        <ConfigurationMapSection key={i}>
          <ConfigurationMapHeading>
            <FormattedMessage
              id="XXXX"
              defaultMessage={`Health Check Result`}
            />
            {i + 1}
          </ConfigurationMapHeading>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage id="XXXX" defaultMessage={`First success`} />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.firstSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage id="XXXX" defaultMessage={`Last success`} />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage id="XXXX" defaultMessage={`Last failure`} />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastFailure)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="XXXX"
                defaultMessage={`Consecutive failures`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {consecutiveFailures}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage id="XXXX" defaultMessage={`Alive`} />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {alive}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
        </ConfigurationMapSection>
      );
    });
  }

  render() {
    const marathonTask = DCOSStore.serviceTree.getTaskFromTaskID(
      this.props.taskID
    );
    const taskConfiguration = this.getMarathonTaskDetails(marathonTask);
    const healthCheckResults = this.getMarathonTaskHealthCheckResults(
      marathonTask
    );

    return (
      <ConfigurationMapSection>
        {taskConfiguration}
        {healthCheckResults}
      </ConfigurationMapSection>
    );
  }
}

MarathonTaskDetailsList.propTypes = {
  taskID: React.PropTypes.string.isRequired
};

module.exports = MarathonTaskDetailsList;
