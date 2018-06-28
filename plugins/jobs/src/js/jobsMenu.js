import jobsRunNow from "./jobsRunNow";
import jobsToggleSchedule from "./jobsToggleSchedule";
import jobsDelete from "./jobsDelete";

export default function jobsMenu(job, customActionHandlers) {
  if (!job) {
    return [];
  }

  const actions = [];

  actions.push({
    label: "Edit",
    onItemSelect: customActionHandlers.edit
  });

  actions.push(jobsRunNow(job.getId()));

  if (job.schedules.length !== 0) {
    actions.push(jobsToggleSchedule(job));
  }

  actions.push(jobsDelete(job, customActionHandlers.delete));

  return actions;
}
