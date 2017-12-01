import { injectIntl } from "react-intl";
const HealthBarStates = {
  tasksUnknown: {
    className: "unknown",
    label: this.props.intl.formatMessage({
      id: "SJ2p32mJbf",
      defaultMessage: "Unknown"
    })
  },
  tasksHealthy: {
    className: "healthy",
    label: this.props.intl.formatMessage({
      id: "r1662h71bf",
      defaultMessage: "Healthy"
    })
  },
  tasksOverCapacity: {
    className: "over-capacity",
    label: this.props.intl.formatMessage({
      id: "rk0a23XkbM",
      defaultMessage: "Over Capacity"
    })
  },
  tasksUnhealthy: {
    className: "unhealthy",
    label: this.props.intl.formatMessage({
      id: "H1JgpnhQk-f",
      defaultMessage: "Unhealthy"
    })
  },
  tasksStaged: {
    className: "staged",
    label: this.props.intl.formatMessage({
      id: "ByelT3nQJZG",
      defaultMessage: "Staged"
    })
  }
};

module.exports = injectIntl(HealthBarStates);
