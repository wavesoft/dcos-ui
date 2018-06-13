/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import { graphqlObservable } from "data-service";
import gql from "graphql-tag";
import "rxjs/add/operator/concatMap";

import { Subject } from "rxjs/Subject";
import defaultSchema from "./data/JobModel";
import StringUtil from "../../../../utils/StringUtil";
import UserActions from "../../../../constants/UserActions";

const deleteJobMutation = gql`
  mutation {
    deleteJob(id: $id) {
      id
    }
  }
`;

const deleteJobGraphql = id => {
  return graphqlObservable(deleteJobMutation, defaultSchema, id);
};

export const deleteEvent$ = new Subject();
export const jobsDelete$ = deleteEvent$.switchMap(id => {
  return deleteJobGraphql(id);
});

export const deleteJobAction = id => {
  return {
    className: "text-danger",
    label: StringUtil.capitalize(UserActions.DELETE),
    onItemSelect() {
      deleteEvent$.next({ id });
    }
  };
};
