const HealthBarStates = {
  tasksUnknown: {
    className: "unknown",
    label: formatMessage({ id: "XXXX", defaultMessage: "Unknown" })
  },
  tasksHealthy: {
    className: "healthy",
    label: formatMessage({ id: "XXXX", defaultMessage: "Healthy" })
  },
  tasksOverCapacity: {
    className: "over-capacity",
    label: formatMessage({ id: "XXXX", defaultMessage: "Over Capacity" })
  },
  tasksUnhealthy: {
    className: "unhealthy",
    label: formatMessage({ id: "XXXX", defaultMessage: "Unhealthy" })
  },
  tasksStaged: {
    className: "staged",
    label: formatMessage({ id: "XXXX", defaultMessage: "Staged" })
  }
};

module.exports = HealthBarStates;
