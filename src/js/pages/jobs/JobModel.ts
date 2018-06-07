import { makeExecutableSchema } from "graphql-tools";
import { Observable } from "rxjs";
import JobStates from "../../constants/JobStates";
import JobStatus from "../../constants/JobStatus";

interface ISchedule {
  concurrencyPolicy: string;
  cron: string;
  enabled: boolean;
  id: string;
  nextRunAt: string;
  startingDeadlineSeconds: number;
  timezone: string;
}

interface IJobResponse {
  id: string;
  labels?: object;
  run: {
    cpus: number;
    mem: number;
    disk: number;
    cmd: string;
    env: object;
    placement: {
      constraints: any[];
    };
    artifacts: any[];
  };
  schedules: ISchedule[];
  historySummary: {
    failureCount: number;
    lastFailureAt: string;
    lastSuccessAt: string;
    successCount: number;
  };
}

interface IJobDetailResponse {
  id: string;
  description: string;
  labels: object;
  run: {
    cpus: number;
    mem: number;
    disk: number;
    cmd: string;
    env: {};
    placement: {
      constraints: any[];
    };
    artifacts: any[];
    maxLaunchDelay: number;
    volumes: any[];
    restart: {
      policy: string;
    };
    docker?: {
      secrets: object;
      forcePullImage: boolean;
      image: string;
    };
  };
  schedules: any[];
  activeRuns: any[];
  history: IJobHistory;
}

interface IJobHistoryRun {
  id: string;
  createdAt: string;
  finishedAt: string;
}

interface IJobHistory {
  successCount: number;
  failureCount: number;
  lastSuccessAt: string;
  lastFailureAt: null;
  successfulFinishedRuns: IJobHistoryRun[];
  failedFinishedRuns: IJobHistoryRun[];
}

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

export const typeDefs = `
	type JobRunSummary {
		lastFailureAt: String
		lastSuccessAt: String
		status: JobRunStatus
	}

	type Job {
		id: ID!
		name: String!
		status: JobStatus!
		lastRun: JobRunSummary!
	}

  type JobDetail {
    id: ID!
		name: String!
		description: String!
    cpus: Float!
    mem: Int!
    disk: Float!
    cmd: String!
    schedule: JobSchedule!
    docker: JobDocker!
    labels: [JobLabel]!
    runs: [JobRun]!
  }

  type JobRun {
    id: ID!
    finishedAt: Int!
    createdAt: Int!
    status: JobStatus!
    runTime: Int!
    children: [JobRunTask]!
  }

  type JobRunTask {
    taskId: ID!
    status: JobRunStatus!
    startedAt: Int!
    finishedAt: Int!
    runTime: Int!
  }

  type JobSchedule {
    id: ID!
    enabled: Boolean!
    cron: String!
    timezone: String!
    startingDeadlineSeconds: Int!
  }

  type JobDocker {
    image: String!
    forcePullImage: Boolean!
  }

  type JobLabel {
    key: String!
    value: String!
  }

	enum JobRunStatus {
		NOT_AVAILABLE
		SUCCESS
		FAILED
	}

	enum JobStatus {
		RUNNING
		COMPLETED
		SCHEDULED
		UNSCHEDULED
		FAILED
		ACTIVE
		STARTING
		INITIAL
	}

	type Namespace {
		id: ID!
		name: String!
		items: MetronomeItem
	}

	union MetronomeItem = Job | Namespace

	type SearchCount {
		all: Int!
		filtered: Int!
	}

	type MetronomeResult {
		count: SearchCount!
		items: [MetronomeItem]!
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
		metronomeItems(filter: String, sortBy: SortOption, sortDirection: SortDirection): MetronomeResult
		metronomeItem(id: ID!, filter: String, sortBy: SortOption, sortDirection: SortDirection): MetronomeResult
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
  MetronomeItem: {
    __resolverType(obj: IJobResponse, _args: IJobsArg = {}, _context = {}) {
      return isNamespace(obj) ? "Namespace" : "Job";
    }
  },
  Query: {
    metronomeItems(_obj = {}, args: IJobsArg = {}, _context = {}) {
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
    metronomeItem(_obj = {}, { id }: IJobDetailArgs, _context = {}) {
      const pollingInterval$ = Observable.interval(pollingInterval);
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

export const defaultSchema = makeExecutableSchema({
  typeDefs,
  resolvers: {} // TODO: fill with real interval and API
});
