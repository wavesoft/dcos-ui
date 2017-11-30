import { injectIntl } from "react-intl";
const HealthBarStates = {
  tasksUnknown: {
    className: "unknown",
    label: this.props.intl.formatMessage({
      id: "XXXX",
      defaultMessage: "Unknown"
    })
  },
  tasksHealthy: {
    className: "healthy",
    label: this.props.intl.formatMessage({
      id: "XXXX",
      defaultMessage: "Healthy"
    })
  },
  tasksOverCapacity: {
    className: "over-capacity",
    label: this.props.intl.formatMessage({
      id: "XXXX",
      defaultMessage: "Over Capacity"
    })
  },
  tasksUnhealthy: {
    className: "unhealthy",
    label: this.props.intl.formatMessage({
      id: "XXXX",
      defaultMessage: "Unhealthy"
    })
  },
  tasksStaged: {
    className: "staged",
    label: this.props.intl.formatMessage({
      id: "XXXX",
      defaultMessage: "Staged"
    })
  }
};

module.exports = injectIntl(HealthBarStates);
