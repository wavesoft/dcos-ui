/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

const General = intl => {
  return {
    title: intl.formatMessage({
      id: "HyP63Qk-M",
      defaultMessage: "Docker Container"
    }),
    description: intl.formatMessage({
      id: "H1eDpnmkZM",
      defaultMessage: "Configure your job settings"
    }),
    type: "object",
    properties: {
      image: {
        title: intl.formatMessage({
          id: "HyZw6nQkZM",
          defaultMessage: "Image"
        }),
        description: intl.formatMessage({
          id: "SJMDahmJWf",
          defaultMessage: "Name of your Docker image"
        }),
        type: "string",
        getter(job) {
          return job.getDocker().image;
        }
      }
    },
    required: []
  };
};

module.exports = General;
