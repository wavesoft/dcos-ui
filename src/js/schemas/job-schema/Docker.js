import { formatMessage } from "react-intl"; /* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

const General = {
  title: formatMessage({ id: "XXXX", defaultMessage: "Docker Container" }),
  description: formatMessage({
    id: "XXXX",
    defaultMessage: "Configure your job settings"
  }),
  type: "object",
  properties: {
    image: {
      title: formatMessage({ id: "XXXX", defaultMessage: "Image" }),
      description: formatMessage({
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

module.exports = General;
