/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import JobValidatorUtil from "../../utils/JobValidatorUtil";
import ValidatorUtil from "../../utils/ValidatorUtil";
import MesosConstants
  from "../../../../plugins/services/src/js/constants/MesosConstants";
import JobResources from "../../constants/JobResources";

const General = {
  title: formatMessage({ id: "XXXX", defaultMessage: "General" }),
  description: formatMessage({
    id: "XXXX",
    defaultMessage: "Configure your job settings"
  }),
  type: "object",
  properties: {
    id: {
      focused: true,
      title: formatMessage({ id: "XXXX", defaultMessage: "ID" }),
      description: formatMessage({ id: "XXXX", defaultMessage: "The job ID" }),
      type: "string",
      getter(job) {
        return job.getId();
      },
      externalValidator({ general }, definition) {
        if (!JobValidatorUtil.isValidJobID(general.id)) {
          definition.showError =
            "ID must not be empty, must not contain " +
            "whitespace, and should not contain any other characters than " +
            'lowercase letters, digits, hyphens, ".", and ".."';

          return false;
        }

        return true;
      }
    },
    description: {
      title: formatMessage({ id: "XXXX", defaultMessage: "Description" }),
      description: formatMessage({
        id: "XXXX",
        defaultMessage: "Job description"
      }),
      type: "string",
      getter(job) {
        return job.getDescription();
      }
    },
    resources: {
      type: "group",
      properties: {
        cpus: {
          title: formatMessage({ id: "XXXX", defaultMessage: "CPUs" }),
          default: JobResources.DEFAULT_CPUS,
          description: formatMessage({
            id: "XXXX",
            defaultMessage: "The amount of CPUs the job requires"
          }),
          type: "number",
          getter(job) {
            return `${job.getCpus()}`;
          },
          externalValidator({ general }, definition) {
            if (
              !ValidatorUtil.isNumberInRange(general.cpus, {
                min: MesosConstants.MIN_CPUS
              })
            ) {
              definition.showError =
                "CPUs must be a number at least equal to " +
                MesosConstants.MIN_CPUS;

              return false;
            }

            return true;
          }
        },
        mem: {
          title: "Mem (MiB)",
          default: JobResources.DEFAULT_MEM,
          type: "number",
          getter(job) {
            return `${job.getMem()}`;
          },
          externalValidator({ general }, definition) {
            if (
              !ValidatorUtil.isNumberInRange(general.mem, {
                min: MesosConstants.MIN_MEM
              })
            ) {
              definition.showError =
                "Mem must be a number and at least " +
                MesosConstants.MIN_MEM +
                " MiB";

              return false;
            }

            return true;
          }
        },
        disk: {
          title: "Disk (MiB)",
          default: JobResources.DEFAULT_DISK,
          type: "number",
          getter(job) {
            return `${job.getDisk()}`;
          },
          externalValidator({ general }, definition) {
            if (
              ValidatorUtil.isDefined(general.disk) &&
              !ValidatorUtil.isNumberInRange(general.disk)
            ) {
              definition.showError = "Disk must be a positive number";

              return false;
            }

            return true;
          }
        }
      }
    },
    cmd: {
      title: formatMessage({ id: "XXXX", defaultMessage: "Command" }),
      description: formatMessage({
        id: "XXXX",
        defaultMessage: "The command executed by the service"
      }),
      type: "string",
      multiLine: true,
      getter(job) {
        return job.getCommand();
      }
    }
  },
  required: ["id"]
};

module.exports = General;
