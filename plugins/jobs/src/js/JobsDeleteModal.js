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

export default componentFromStream(props$ => {
  return props$.map(({ checkedItems, hasCheckedTasks }) => {
    if (!hasCheckedTasks) {
      return null;
    }

    const { isStopRunModalShown } = this.state;
    const jobRuns = Object.keys(checkedItems);

    return (
      <JobStopRunModal
        jobID={this.props.job.getId()}
        selectedItems={jobRuns}
        onClose={this.handleStopJobRunModalClose}
        onSuccess={this.handleStopJobRunSuccess}
        open={isStopRunModalShown}

        action={action}
      />
    );
  });
});
