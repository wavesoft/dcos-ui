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
            id="SJSxsnhX1WM"
            defaultMessage={`Marathon Task Configuration`}
          />
        </ConfigurationMapHeading>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="SyUxjh2m1bG" defaultMessage={`Host`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {task.host}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="Bkwei237JZf" defaultMessage={`Ports`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTaskPorts(task)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="SJ_xih37kZz" defaultMessage={`Status`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTaskStatus(task)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="r1tgo3371Zf" defaultMessage={`Staged at`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.stagedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="SJ9xo23myZf" defaultMessage={`Started at`} />
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.startedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <FormattedMessage id="Bkixoh27yWf" defaultMessage={`Version`} />
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
              id="B12gshh7y-z"
              defaultMessage={`Health Check Result`}
            />
            {i + 1}
          </ConfigurationMapHeading>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="r1Txi227kbz"
                defaultMessage={`First success`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.firstSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="Sk0xo33mkWG"
                defaultMessage={`Last success`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="rkkWi32Xk-G"
                defaultMessage={`Last failure`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastFailure)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage
                id="BygWin37k-z"
                defaultMessage={`Consecutive failures`}
              />
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {consecutiveFailures}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <FormattedMessage id="HyZWohnm1WM" defaultMessage={`Alive`} />
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
