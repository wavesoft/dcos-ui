/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import JobValidatorUtil from "../../utils/JobValidatorUtil";
import MetadataStore from "../../stores/MetadataStore";
import ValidatorUtil from "../../utils/ValidatorUtil";

const Schedule = intl => {
  return {
    title: intl.formatMessage({
      id: "r1-xwTnmJbM",
      defaultMessage: "Schedule"
    }),
    description: intl.formatMessage({
      id: "B1GgPT2mJZz",
      defaultMessage: "Set time and date for the job to run"
    }),
    type: "object",
    properties: {
      runOnSchedule: {
        label: intl.formatMessage({
          id: "Hy7xwanQyZz",
          defaultMessage: "Run on a schedule"
        }),
        showLabel: true,
        title: intl.formatMessage({
          id: "rkNlDTn7JZf",
          defaultMessage: "Run on a schedule"
        }),
        type: "boolean",
        getter(job) {
          const [schedule] = job.getSchedules();

          return schedule != null;
        }
      },
      cron: {
        title: intl.formatMessage({
          id: "H1HePa2QyZz",
          defaultMessage: "CRON Schedule"
        }),
        helpBlock: (
          <span>
            {intl.formatMessage({
              id: "HkUlwp3QJZf",
              defaultMessage: "Use cron format to set your schedule, e.g "
            })}
            /&gt;<i>0 0 20 * *</i>{". "}
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
        title: intl.formatMessage({
          id: "BkwxDah7k-z",
          defaultMessage: "Time Zone"
        }),
        description: (
          <span>
            {intl.formatMessage({
              id: "ry_ew6nXkZz",
              defaultMessage: "Enter time zone in "
            })}
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
        title: intl.formatMessage({
          id: "HJtgwphX1Wz",
          defaultMessage: "Starting Deadline"
        }),
        description: intl.formatMessage({
          id: "S1clPpn7kbf",
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

          if (
            !ValidatorUtil.isNumberInRange(schedule.startingDeadlineSeconds)
          ) {
            definition.showError = "Expecting a positive number here";

            return true;
          }

          return true;
        }
      },
      enabled: {
        label: intl.formatMessage({
          id: "rJilDp3Qy-G",
          defaultMessage: "Enabled"
        }),
        showLabel: true,
        title: intl.formatMessage({
          id: "BJhgDpnX1WM",
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
};

module.exports = Schedule;
