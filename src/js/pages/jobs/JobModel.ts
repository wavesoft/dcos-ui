import { makeExecutableSchema } from "graphql-tools";
import { Observable } from "rxjs";
import {
  fetchJobs,
  fetchJobDetail,
  IJobResponse,
  IJobDetailResponse,
  IJobHistory,
  IJobHistoryRun
} from "../../events/MetronomeClient";
import Config from "../../config/Config";
import JobStates from "../../constants/JobStates";
import JobStatus from "../../constants/JobStatus";

interface IJobRun {
  id: string;
  finishedAt: number;
  createdAt: number;
  status: string;
  runTime: number;
  children: any[];
}

interface IJobsArg {
  filter?: string;
  sortBy?: string;
  sortDirection?: string;
}

interface IJobDetailArgs {
  id: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface JobsQueryArgs {
  filter: string | null;
  sortBy: SortOption | null;
  sortDirection: SortDirection | null;
}

export interface JobQueryArgs {
  id: string;
  filter: string | null;
  sortBy: SortOption | null;
  sortDirection: SortDirection | null;
}

export type SortOption = "ID" | "STATUS" | "LAST_RUN";

export type SortDirection = "ASC" | "DESC";

export interface JobConnection {
  filteredCount: number;
  totalCount: number;
  nodes: Job[];
}

export interface Job {
  activeRuns: JobRunConnection;
  command: string;
  cpus: number;
  description: string;
  disk: number;
  docker: Docker | null;
  id: string;
  jobRuns: JobRunConnection;
  json: string;
  labels: Label[];
  lastRunsSummary: JobHistorySummary;
  lastRunStatus: JobRunStatus;
  mem: number;
  name: string;
  schedules: ScheduleConnection;
  scheduleStatus: JobStatus;
}

export interface JobRunConnection {
  longestRunningActiveRun: JobRun | null;
  nodes: JobRun[];
}

export interface JobRun {
  dateCreated: number;
  dateFinished: number;
  jobID: string;
  status: JobRunStatus;
  tasks: JobTaskConnection;
}

export type JobRunStatus = "FAILED" | "NOT_AVAILABLE" | "SUCCESS";

export interface JobTaskConnection {
  longestRunningTask: JobTask;
  nodes: JobTask[];
}

export interface JobTask {
  dateCompleted: number;
  dateStarted: number;
  status: JobTaskStatus;
  taskId: string;
}

export type JobTaskStatus =
  | "TASK_CREATED"
  | "TASK_DROPPED"
  | "TASK_ERROR"
  | "TASK_FAILED"
  | "TASK_FINISHED"
  | "TASK_GONE"
  | "TASK_GONE_BY_OPERATOR"
  | "TASK_KILLED"
  | "TASK_KILLING"
  | "TASK_LOST"
  | "TASK_RUNNING"
  | "TASK_STAGING"
  | "TASK_STARTED"
  | "TASK_STARTING"
  | "TASK_UNKNOWN"
  | "TASK_UNREACHABLE";

export interface Docker {
  forcePullImage: boolean;
  image: string;
}

export interface Label {
  key: string;
  value: string;
}

export interface JobHistorySummary {
  failureCount: number;
  lastFailureAt: string | null;
  lastSuccessAt: string | null;
  successCount: number;
}

export interface ScheduleConnection {
  nodes: Schedule[];
}

export interface Schedule {
  cron: string;
  enabled: boolean;
  id: string;
  startingDeadlineSeconds: number;
  timezone: string;
}

export type JobStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "FAILED"
  | "INITIAL"
  | "RUNNING"
  | "SCHEDULED"
  | "STARTING"
  | "UNSCHEDULED";

export const typeDefs = `
type Job {
  activeRuns: JobRunConnection!
  command: String!
  cpus: Float!
  description: String!
  disk: Float!
  docker: Docker
  id: ID!
  jobRuns: JobRunConnection!
  json: String!
  labels: [Label]!
  lastRunsSummary: JobHistorySummary!
  lastRunStatus: JobRunStatus!
  mem: Int!
  name: String!
  schedules: ScheduleConnection!
  scheduleStatus: JobStatus!
}

type JobRunConnection {
  longestRunningActiveRun: JobRun
  nodes: [JobRun]!
}

type JobRun {
  dateCreated: Int!
  dateFinished: Int!
  jobID: String!
  status: JobRunStatus!
  tasks: JobTaskConnection!
}

type JobTaskConnection {
  longestRunningTask: JobTask!
  nodes: [JobTask]!
}

type JobTask {
  dateCompleted: Int!
  dateStarted: Int!
  status: JobTaskStatus!
  taskId: String!
}

type JobHistorySummary {
  failureCount: Int!
  lastFailureAt: String
  lastSuccessAt: String
  successCount: Int!
}

type Docker {
  forcePullImage: Boolean!
  image: String!
}

type Label {
  key: String!
  value: String!
}

type JobRunStatus {
  status: String
  time: Int
}

type ScheduleConnection {
  nodes: [Schedule]!
}

type Schedule {
  cron: String!
  enabled: Boolean!
  id: ID!
  startingDeadlineSeconds: Int!
  timezone: String!
}

enum JobTaskStatus {
  TASK_CREATED
  TASK_DROPPED
  TASK_ERROR
  TASK_FAILED
  TASK_FINISHED
  TASK_GONE
  TASK_GONE_BY_OPERATOR
  TASK_KILLED
  TASK_KILLING
  TASK_LOST
  TASK_RUNNING
  TASK_STAGING
  TASK_STARTED
  TASK_STARTING
  TASK_UNKNOWN
  TASK_UNREACHABLE
}

enum JobRunStatus {
  FAILED
  NOT_AVAILABLE
  SUCCESS
}

enum JobStatus {
  ACTIVE
  COMPLETED
  FAILED
  INITIAL
  RUNNING
  SCHEDULED
  STARTING
  UNSCHEDULED
}

type JobConnection {
  filteredCount: Int!
  totalCount: Int!
  nodes: [Job]!
}

enum SortOption {
  ID
  STATUS
  LAST_RUN
}

enum SortDirection {
  ASC
  DESC
}

type Query {
  jobs(
    filter: String
    sortBy: SortOption
    sortDirection: SortDirection
  ): JobConnection
  job(
    id: ID!
    filter: String
    sortBy: SortOption
    sortDirection: SortDirection
  ): Job
}
`;

function isNamespace(job: IJobResponse): boolean {
  return job.id.split(".").length > 1;
}

function sortJobById(a: IJobResponse, b: IJobResponse): number {
  return a.id.localeCompare(b.id);
}

interface IJobResponseWithStatus extends IJobResponse {
  status: string;
  lastRun: {
    status: string;
  };
}

function sortJobByStatus(
  a: IJobResponseWithStatus,
  b: IJobResponseWithStatus
): number {
  return JobStates[a.status].sortOrder - JobStates[b.status].sortOrder;
}

function sortJobByLastRun(
  a: IJobResponseWithStatus,
  b: IJobResponseWithStatus
): number {
  return (
    JobStatus[a.lastRun.status].sortOrder -
    JobStatus[b.lastRun.status].sortOrder
  );
}

function response2Namespace(response: IJobResponse) {
  return {
    id: "ns-" + response.id.split(".")[0],
    name: response.id.split(".")[0],
    response,
    items: []
  };
}
function response2Job(response: IJobResponse) {
  return {
    id: "j-" + response.id,
    name: response.id,
    status: "TBD",
    lastrun: "TBD"
  };
}

export const resolvers = ({
  fetchJobs,
  fetchJobDetail,
  pollingInterval
}: {
  fetchJobs: () => Observable<IJobResponse[]>;
  fetchJobDetail: (jobId: string) => Observable<IJobDetailResponse>;
  pollingInterval: number;
}) => ({
  Query: {
    jobs(
      _obj = {},
      args: IJobsArg = {},
      _context = {}
    ): Observable<JobConnection> {
      const { sortBy = "id", sortDirection = "ASC", filter } = args;
      const pollingInterval$ = Observable.interval(pollingInterval);
      const responses$ = pollingInterval$.switchMap(fetchJobs);

      const filteredResponses$ = !filter
        ? responses$
        : responses$.map(jobs =>
            jobs.filter(({ id }) => id.indexOf(filter) !== -1)
          );

      // TODO: data mangling
      // .map(response => ({ ...response, struct: new Job(response) }))
      // .map(response => ({
      //   id: response.id,
      //   lastRun: {
      //     status: response.struct.getLastRunStatus().status,
      //     lastSuccessAt: response.historySummary.lastSuccessAt,
      //     lastFailureAt: response.historySummary.lastFailureAt
      //   },
      //   name: response.struct.getName(),
      //   schedules: response.struct.getSchedules(),
      //   status: response.struct.getScheduleStatus()
      // }));

      return filteredResponses$
        .map(jobs =>
          jobs.sort((a, b) => {
            const direction = sortDirection === "ASC" ? 1 : -1;
            const isANamespace = isNamespace(a);
            const isBNamespace = isNamespace(b);

            if (isANamespace && !isBNamespace) {
              return -1;
            }

            if (!isANamespace && isBNamespace) {
              return 1;
            }

            let result = 0;
            const aWithStatus = a as IJobResponseWithStatus;
            const bWithStatus = b as IJobResponseWithStatus;

            switch (sortBy) {
              case "id":
                result = sortJobById(a, b);
                break;
              case "status":
                result = sortJobByStatus(aWithStatus, bWithStatus);
                break;
              case "lastRun":
                result = sortJobByLastRun(aWithStatus, bWithStatus);
                break;
            }

            return result * direction;
          })
        )
        .map(responses => {
          // MetronomeResult
          return {
            count: responses.length,
            items: responses.map(response => {
              // MetronomeItem
              return isNamespace(response)
                ? response2Namespace(response)
                : response2Job(response);
            })
          };
        });
    },
    job(_obj = {}, { id }: IJobDetailArgs, _context = {}): Observable<Job> {
      console.log("JobModel");
      const pollingInterval$ = Observable.interval(pollingInterval);
      // TODO: change to exhaust map
      const responses$ = pollingInterval$.switchMap(() => fetchJobDetail(id));

      function historyToRuns(
        { successfulFinishedRuns, failedFinishedRuns }: IJobHistory,
        activeRuns: IJobHistoryRun[]
      ): IJobRun[] {
        return [
          ...successfulFinishedRuns.map(successfulFinishedRun => ({
            ...successfulFinishedRun,
            status: "SUCCESS"
          })),
          ...failedFinishedRuns.map(failedFinishedRun => ({
            ...failedFinishedRun,
            status: "FAILED"
          })),
          ...activeRuns.map(activeRun => ({
            ...activeRun,
            status: "NOT_AVAILABLE"
          }))
        ].map(run => {
          const finishedAt = new Date(run.finishedAt).getTime();
          const createdAt = new Date(run.createdAt).getTime();

          return {
            id: run.id,
            finishedAt,
            createdAt,
            status: run.status,
            runTime: finishedAt - createdAt,
            children: []
          };
        });
      }

      return responses$.map(
        ({
          id,
          description,
          labels,
          history,
          activeRuns,
          run: { cpus, cmd, mem, disk, docker = {} }
        }) => {
          return {
            id,
            name: id,
            description,
            cpus,
            cmd,
            mem,
            disk,
            labels,
            docker,
            runs: historyToRuns(history, activeRuns),
            schedule: null // TODO: fill me
          };
        }
      );
    }
  }
});

export default makeExecutableSchema({
  typeDefs,
  resolvers: resolvers({
    fetchJobDetail,
    fetchJobs,
    pollingInterval: Config.getRefreshRate()
  })
});
