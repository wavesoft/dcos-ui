import { formatMessage } from "react-intl"; /* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

const General = {
  title: this.props.intl.formatMessage({
    id: "XXXX",
    defaultMessage: "Docker Container"
  }),
  description: this.props.intl.formatMessage({
    id: "XXXX",
    defaultMessage: "Configure your job settings"
  }),
  type: "object",
  properties: {
    image: {
      title: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Image"
      }),
      description: this.props.intl.formatMessage({
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
