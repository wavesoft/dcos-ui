import * as React from "react";
import { componentFromStream } from "data-service";
import MetronomeStore from "#SRC/js/stores/MetronomeStore";

import JobStopRunModal from "./components/JobStopRunModal";

function action(jobID, selectedItem) {
  MetronomeStore.stopJobRun(jobID, selectedItem);
}

// TODO: pendingRequest state
// this.props.onClose();
// this.props.onSuccess();

// isStopRunModalShown

const JobsStopRun = componentFromStream(props$ => {
  return props$.map(
    ({
      job,
      onClose,
      onSuccess,
      checkedItems,
      hasCheckedTasks,
      isStopRunModalShown
    }) => {
      if (!hasCheckedTasks) {
        return null;
      }

      const jobRuns = Object.keys(checkedItems);

      return (
        <JobStopRunModal
          jobID={job.getId()}
          selectedItems={jobRuns}
          onClose={onClose}
          onSuccess={onSuccess}
          open={isStopRunModalShown}
          action={action}
        />
      );
    }
  );
});

export default JobsStopRun;
