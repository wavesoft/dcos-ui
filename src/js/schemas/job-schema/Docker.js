/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

const General = intl => {
  return {
    title: intl.formatMessage({
      id: "XXXX",
      defaultMessage: "Docker Container"
    }),
    description: intl.formatMessage({
      id: "XXXX",
      defaultMessage: "Configure your job settings"
    }),
    type: "object",
    properties: {
      image: {
        title: intl.formatMessage({
          id: "XXXX",
          defaultMessage: "Image"
        }),
        description: intl.formatMessage({
          id: "XXXX",
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
