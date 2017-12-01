const Labels = intl => {
  return {
    type: "object",
    title: intl.formatMessage({
      id: "HkaDT3Q1bG",
      defaultMessage: "Labels"
    }),
    description: "Attach metadata to jobs to expose additional information to other jobs.",
    properties: {
      items: {
        type: "array",
        duplicable: true,
        addLabel: intl.formatMessage({
          id: "SkCwTn71Wf",
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
              title: intl.formatMessage({
                id: "BJJxDpn7kZG",
                defaultMessage: "Label Name"
              }),
              type: "string"
            },
            value: {
              title: intl.formatMessage({
                id: "SyxlPphQ1-G",
                defaultMessage: "Label Value"
              }),
              type: "string"
            }
          }
        }
      }
    }
  };
};

module.exports = Labels;
