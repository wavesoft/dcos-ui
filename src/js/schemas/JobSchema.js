/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import Docker from "./job-schema/Docker";
import General from "./job-schema/General";
import Labels from "./job-schema/Labels";
import Schedule from "./job-schema/Schedule";

const JobSchema = intl => {
  return {
    type: "object",
    properties: {
      general: General(intl),
      schedule: Schedule(intl),
      docker: Docker(intl),
      labels: Labels(intl)
    },
    required: ["general"]
  };
};

module.exports = JobSchema;
