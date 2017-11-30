import {
  FormattedMessage,
  formatMessage
} from "react-intl"; /* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import JobValidatorUtil from "../../utils/JobValidatorUtil";
import MetadataStore from "../../stores/MetadataStore";
import ValidatorUtil from "../../utils/ValidatorUtil";

const Schedule = {
  title: this.props.intl.formatMessage({
    id: "XXXX",
    defaultMessage: "Schedule"
  }),
  description: this.props.intl.formatMessage({
    id: "XXXX",
    defaultMessage: "Set time and date for the job to run"
  }),
  type: "object",
  properties: {
    runOnSchedule: {
      label: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Run on a schedule"
      }),
      showLabel: true,
      title: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Run on a schedule"
      }),
      type: "boolean",
      getter(job) {
        const [schedule] = job.getSchedules();

        return schedule != null;
      }
    },
    cron: {
      title: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "CRON Schedule"
      }),
      helpBlock: (
        <span>
          <FormattedMessage
            id="XXXX"
            defaultMessage={`
          Use cron format to set your schedule, e.g. `}
          /><i>0 0 20 * *</i>{". "}
          <a
            href={MetadataStore.buildDocsURI("/usage/jobs/getting-started")}
            target="_blank"
          >
            View documentation
          </a>.
        </span>
      ),
      type: "string",
      getter(job) {
        const [schedule = {}] = job.getSchedules();

        return schedule.cron;
      },
      externalValidator({ schedule }, definition) {
        if (!schedule.runOnSchedule) {
          return true;
        }

        if (!JobValidatorUtil.isValidCronSchedule(schedule.cron)) {
          definition.showError =
            "CRON Schedule must not be empty and it must " +
            "follow the correct CRON format specifications";

          return false;
        }

        return true;
      }
    },
    timezone: {
      title: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Time Zone"
      }),
      description: (
        <span>
          <FormattedMessage id="XXXX" defaultMessage={`Enter time zone in `} />
          <a
            href="http://www.timezoneconverter.com/cgi-bin/zonehelp"
            target="_blank"
          >
            TZ format
          </a>, e.g. America/New_York.
        </span>
      ),
      type: "string",
      getter(job) {
        const [schedule = {}] = job.getSchedules();

        return schedule.timezone;
      }
    },
    startingDeadlineSeconds: {
      title: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Starting Deadline"
      }),
      description: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Time in seconds to start the job if it misses "
      }) +
        "scheduled time for any reason. Missed jobs executions will be " +
        "counted as failed ones.",
      type: "number",
      getter(job) {
        const [schedule = {}] = job.getSchedules();

        return schedule.startingDeadlineSeconds;
      },
      externalValidator({ schedule }, definition) {
        if (!schedule.runOnSchedule) {
          return true;
        }

        if (!ValidatorUtil.isDefined(schedule.startingDeadlineSeconds)) {
          return true;
        }

        if (!ValidatorUtil.isNumberInRange(schedule.startingDeadlineSeconds)) {
          definition.showError = "Expecting a positive number here";

          return true;
        }

        return true;
      }
    },
    enabled: {
      label: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Enabled"
      }),
      showLabel: true,
      title: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Enabled"
      }),
      type: "boolean",
      getter(job) {
        const [schedule = {}] = job.getSchedules();

        return schedule.enabled !== undefined ? schedule.enabled : false;
      }
    }
  },
  required: ["cron"]
};

module.exports = Schedule;
