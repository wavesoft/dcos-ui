import { formatMessage } from "react-intl";
const Labels = {
  type: "object",
  title: this.props.intl.formatMessage({
    id: "XXXX",
    defaultMessage: "Labels"
  }),
  description: "Attach metadata to jobs to expose additional information to other jobs.",
  properties: {
    items: {
      type: "array",
      duplicable: true,
      addLabel: this.props.intl.formatMessage({
        id: "XXXX",
        defaultMessage: "Add Label"
      }),
      getter(job) {
        const labels = job.getLabels() || {};

        return Object.keys(labels).map(function(key) {
          return {
            key,
            value: labels[key]
          };
        });
      },
      itemShape: {
        properties: {
          key: {
            title: this.props.intl.formatMessage({
              id: "XXXX",
              defaultMessage: "Label Name"
            }),
            type: "string"
          },
          value: {
            title: this.props.intl.formatMessage({
              id: "XXXX",
              defaultMessage: "Label Value"
            }),
            type: "string"
          }
        }
      }
    }
  }
};

module.exports = Labels;
