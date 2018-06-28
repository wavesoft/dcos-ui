import StringUtil from "#SRC/js/utils/StringUtil";
import UserActions from "#SRC/js/constants/UserActions";

// TODO - use delete mediator https://jira.mesosphere.com/browse/DCOS-38492
//      - implement onItemSelect
//      - add jobsDelete-test.js
export default function jobsDelete(_job, deleteHandler) {
  return {
    className: "text-danger",
    label: StringUtil.capitalize(UserActions.DELETE),
    onItemSelect: deleteHandler
  };
}
