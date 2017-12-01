/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import JobValidatorUtil from "../../utils/JobValidatorUtil";
import ValidatorUtil from "../../utils/ValidatorUtil";
import MesosConstants
  from "../../../../plugins/services/src/js/constants/MesosConstants";
import JobResources from "../../constants/JobResources";

const General = intl => {
  return {
    title: intl.formatMessage({
      id: "BJQDa37JZf",
      defaultMessage: "General"
    }),
    description: intl.formatMessage({
      id: "S1EDahmk-G",
      defaultMessage: "Configure your job settings"
    }),
    type: "object",
    properties: {
      id: {
        focused: true,
        title: intl.formatMessage({
          id: "SySPa37kZf",
          defaultMessage: "ID"
        }),
        description: intl.formatMessage({
          id: "BkID6h7kZG",
          defaultMessage: "The job ID"
        }),
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
        title: intl.formatMessage({
          id: "rkPD63QJZf",
          defaultMessage: "Description"
        }),
        description: intl.formatMessage({
          id: "B1Ovp3XkZG",
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
            title: intl.formatMessage({
              id: "rJYDanQkbz",
              defaultMessage: "CPUs"
            }),
            default: JobResources.DEFAULT_CPUS,
            description: intl.formatMessage({
              id: "ry9vTnXk-M",
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
        title: intl.formatMessage({
          id: "HJjDa2Xy-f",
          defaultMessage: "Command"
        }),
        description: intl.formatMessage({
          id: "Bk2P62QJZf",
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
};

module.exports = General;
