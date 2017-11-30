import { FormattedMessage, injectIntl } from "react-intl";
import classNames from "classnames";
import React from "react";
import { Tooltip } from "reactjs-components";

import StatusBar from "#SRC/js/components/StatusBar";
import StringUtil from "#SRC/js/utils/StringUtil";

class HealthBar extends React.Component {
  constructor(props) {
    super(props);

    this.HealthBarStates = {
      tasksUnknown: {
        className: "unknown",
        label: props.intl.formatMessage({
          id: "XXXX",
          defaultMessage: "Unknown"
        })
      },
      tasksHealthy: {
        className: "healthy",
        label: props.intl.formatMessage({
          id: "XXXX",
          defaultMessage: "Healthy"
        })
      },
      tasksOverCapacity: {
        className: "over-capacity",
        label: props.intl.formatMessage({
          id: "XXXX",
          defaultMessage: "Over Capacity"
        })
      },
      tasksUnhealthy: {
        className: "unhealthy",
        label: props.intl.formatMessage({
          id: "XXXX",
          defaultMessage: "Unhealthy"
        })
      },
      tasksStaged: {
        className: "staged",
        label: props.intl.formatMessage({
          id: "XXXX",
          defaultMessage: "Staged"
        })
      }
    };
  }

  getMappedTasksSummary(tasksSummary) {
    return Object.keys(tasksSummary)
      .filter(task => {
        return task !== "tasksRunning";
      })
      .map(taskStatus => {
        return {
          className: this.HealthBarStates[taskStatus].className,
          value: tasksSummary[taskStatus]
        };
      });
  }

  getTaskList(tasksSummary, instancesCount) {
    return Object.keys(tasksSummary)
      .filter(task => {
        return tasksSummary[task] !== 0 && task !== "tasksRunning";
      })
      .map((task, index) => {
        const taskCount = tasksSummary[task];
        const taskNoun = StringUtil.pluralize("Task", taskCount);
        const percentage = parseInt(taskCount / instancesCount * 100, 10);

        const classSet = classNames(
          this.HealthBarStates[task].className,
          "dot icon"
        );

        return (
          <div key={index} className="tooltip-line-item">
            <span className={classSet} />
            {` ${taskCount} ${this.HealthBarStates[task].label} ${taskNoun} `}
            <span className="health-bar-tooltip-instances-total">
              <FormattedMessage
                id="XXXX"
                defaultMessage={`
              of `}
              />{instancesCount}
            </span>
            {` (${percentage}%)`}
          </div>
        );
      });
  }

  renderToolTip() {
    let { tasksSummary, instancesCount } = this.props;

    tasksSummary = this.getTaskList(
      tasksSummary,
      Math.max(tasksSummary.tasksRunning, instancesCount)
    );

    if (tasksSummary.length === 0) {
      return "No Running Tasks";
    }

    return tasksSummary;
  }

  render() {
    let { tasksSummary, instancesCount, isDeploying } = this.props;

    if (tasksSummary == null) {
      return null;
    }

    // This filters overCapacity ou
    tasksSummary = Object.keys(tasksSummary)
      .filter(function(key) {
        return key !== "tasksOverCapacity";
      })
      .reduce(function(memo, key) {
        memo[key] = tasksSummary[key];

        return memo;
      }, {});

    if (isDeploying) {
      tasksSummary = {
        tasksStaged: instancesCount
      };
    }

    return (
      <Tooltip interactive={true} content={this.renderToolTip()}>
        <StatusBar
          className="status-bar--large"
          data={this.getMappedTasksSummary(tasksSummary)}
          scale={instancesCount}
        />
      </Tooltip>
    );
  }
}

HealthBar.defaultProps = {
  isDeploying: false,
  instancesCount: null
};

HealthBar.propTypes = {
  isDeploying: React.PropTypes.bool,
  instancesCount: React.PropTypes.number,
  tasksSummary: React.PropTypes.shape({
    tasksRunning: React.PropTypes.number,
    tasksHealthy: React.PropTypes.number,
    tasksOverCapacity: React.PropTypes.number,
    tasksStaged: React.PropTypes.number,
    tasksUnhealthy: React.PropTypes.number,
    tasksUnknown: React.PropTypes.number
  }).isRequired
};

module.exports = injectIntl(HealthBar);
