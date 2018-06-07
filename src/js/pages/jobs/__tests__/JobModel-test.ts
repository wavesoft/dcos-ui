import { Observable } from "rxjs";
// TODO: remove this disable with https://jira.mesosphere.com/browse/DCOS_OSS-3579
// tslint:disable-next-line:no-submodule-imports
import { marbles } from "rxjs-marbles/jest";
import { resolvers } from "../JobModel";

const defaultJobDetailData = {
  id: "testid",
  description: "test description",
  labels: {},
  run: {
    cpus: 0.01,
    mem: 128,
    disk: 0,
    cmd: "sleep 10",
    env: {},
    placement: {
      constraints: []
    },
    artifacts: [],
    maxLaunchDelay: 3600,
    volumes: [],
    restart: {
      policy: "NEVER"
    },
    secrets: {}
  },
  schedules: [],
  activeRuns: [],
  history: {
    successCount: 3,
    failureCount: 0,
    lastSuccessAt: "2018-06-06T10:49:44.471+0000",
    lastFailureAt: null,
    successfulFinishedRuns: [
      {
        id: "20180606104932xsDzH",
        createdAt: "2018-06-06T10:49:32.336+0000",
        finishedAt: "2018-06-06T10:49:44.471+0000"
      },
      {
        id: "20180606104545rjSRE",
        createdAt: "2018-06-06T10:45:45.890+0000",
        finishedAt: "2018-06-06T10:45:57.236+0000"
      },
      {
        id: "20180606100732E88WQ",
        createdAt: "2018-06-06T10:07:32.972+0000",
        finishedAt: "2018-06-06T10:07:44.265+0000"
      }
    ],
    failedFinishedRuns: [
      {
        createdAt: "2018-06-06T09:31:46.254+0000",
        finishedAt: "2018-06-06T09:31:47.760+0000",
        id: "20180606093146gr5Pi"
      }
    ]
  }
};

const defaultJob = {
  id: "foo.bar.Ponies",
  labels: {},
  run: {
    cpus: 0.01,
    mem: 128,
    disk: 0,
    cmd: "sleep 19999",
    env: {},
    placement: { constraints: [] },
    artifacts: [],
    maxLaunchDelay: 3600,
    volumes: [],
    restart: { policy: "NEVER" },
    secrets: {}
  },
  schedules: [
    {
      concurrencyPolicy: "ALLOW",
      cron: "12 * * * *",
      enabled: false,
      id: "default",
      nextRunAt: "2018-06-04T11:12:00.000+0000",
      startingDeadlineSeconds: 900,
      timezone: "UTC"
    }
  ],
  historySummary: {
    failureCount: 1,
    lastFailureAt: "2017-06-01T10:33:51.875+0000",
    lastSuccessAt: "2018-06-01T10:33:51.875+0000",
    successCount: 1
  }
};
const defaultJobsData = [defaultJob];

const defaultFetchJobs = () => Observable.of(defaultJobsData);
const defaultFetchJobDetail = () => Observable.of(defaultJobDetailData);

describe.skip("JobData", () => {
  it(
    "polls the MetronomeActions.fetchJobs endpoint",
    marbles(m => {
      m.bind();
      const fetchJobs = () => m.cold("--x|", { x: defaultJobsData });
      const result$ = resolvers({
        fetchJobs,
        fetchJobDetail: defaultFetchJobDetail,
        pollingInterval: m.time("--|")
      }).Query.metronomeItems({});
      const expected$ = m.cold("----x-x-(x|)", {
        x: 0 // we are only interested in the timing, not in the data at this point
      });

      m.expect(result$.map(_ => 0).take(3)).toBeObservable(expected$);
    })
  );

  it("does not have two requests open at the same time");

  describe("order", () => {
    const cases = [
      {
        sortBy: "id",
        sortDirection: "ASC",
        input: [
          { ...defaultJob, id: "foo.bar.baz" },
          { ...defaultJob, id: "abc.de.f" },
          { ...defaultJob, id: "peter" },
          { ...defaultJob, id: "anna" },
          { ...defaultJob, id: "heidi" }
        ],
        output: ["abc.de.f", "foo.bar.baz", "anna", "heidi", "peter"]
      },
      {
        sortBy: "id",
        sortDirection: "DESC",
        input: [
          { ...defaultJob, id: "foo.bar.baz" },
          { ...defaultJob, id: "abc.de.f" },
          { ...defaultJob, id: "peter" },
          { ...defaultJob, id: "anna" },
          { ...defaultJob, id: "heidi" }
        ],
        output: ["foo.bar.baz", "abc.de.f", "peter", "heidi", "anna"]
      },
      {
        sortBy: "status",
        sortDirection: "ASC",
        input: [
          { ...defaultJob, status: "INITIAL" },
          { ...defaultJob, status: "ACTIVE" },
          { ...defaultJob, status: "FAILED" },
          { ...defaultJob, status: "SUCCESS" },
          { ...defaultJob, status: "COMPLETED" },
          { ...defaultJob, status: "SCHEDULED" },
          { ...defaultJob, status: "UNSCHEDULED" }
        ],
        output: [
          "FAILED",
          "UNSCHEDULED",
          "SCHEDULED",
          "INITIAL",
          "ACTIVE",
          "COMPLETED",
          "SUCCESS"
        ]
      },
      {
        sortBy: "status",
        sortDirection: "DESC",
        input: [
          { ...defaultJob, status: "INITIAL" },
          { ...defaultJob, status: "ACTIVE" },
          { ...defaultJob, status: "FAILED" },
          { ...defaultJob, status: "SUCCESS" },
          { ...defaultJob, status: "COMPLETED" },
          { ...defaultJob, status: "SCHEDULED" },
          { ...defaultJob, status: "UNSCHEDULED" }
        ],
        output: [
          "SUCCESS",
          "COMPLETED",
          "ACTIVE",
          "INITIAL",
          "SCHEDULED",
          "UNSCHEDULED",
          "FAILED"
        ]
      },
      {
        sortBy: "lastRun",
        sortDirection: "ASC",
        input: [
          { ...defaultJob, lastRun: { status: "N/A" } },
          { ...defaultJob, lastRun: { status: "Success" } },
          { ...defaultJob, lastRun: { status: "Failed" } }
        ],
        output: [{ status: "Failed" }, { status: "N/A" }, { status: "Success" }]
      },
      {
        sortBy: "lastRun",
        sortDirection: "DESC",
        input: [
          { ...defaultJob, lastRun: { status: "N/A" } },
          { ...defaultJob, lastRun: { status: "Success" } },
          { ...defaultJob, lastRun: { status: "Failed" } }
        ],
        output: [{ status: "Success" }, { status: "N/A" }, { status: "Failed" }]
      }
    ];

    for (const { sortBy, sortDirection, input, output } of cases) {
      it(
        `sorts by ${sortBy} ${sortDirection}`,
        marbles(m => {
          m.bind();

          const fetchJobs = () => Observable.of(input);

          const result$ = resolvers({
            fetchJobs,
            fetchJobDetail: defaultFetchJobDetail,
            pollingInterval: m.time("--|")
          }).Query.metronomeItems({}, { sortBy, sortDirection });

          const expected$ = m.cold("--(x|)", {
            x: output
          });
          m.expect(
            result$.take(1).map(result =>
              result.items.map(item => {
                // @ts-ignore: Controlled environemnt / test
                return item[sortBy];
              })
            )
          ).toBeObservable(expected$);
        })
      );
    }
  });

  describe("filter", () => {
    const cases = [
      {
        name: "jobs by substring",
        filter: "cola",
        input: ["fanta", "cola", "pepsi", "fritzcola"],
        output: ["cola", "fritzcola"]
      },
      {
        name: "namespaced jobs by substring",
        filter: "cake",
        input: [
          "cola",
          "cake.strawberry",
          "strawberry.cake",
          "strawberry",
          "cake",
          "soda"
        ],
        output: ["cake.strawberry", "strawberry.cake", "cake"]
      }
    ];
    for (const { name, filter, input, output } of cases) {
      it(
        name,
        marbles(m => {
          m.bind();

          const fetchJobs = () =>
            Observable.of(input.map(id => ({ ...defaultJob, id })));

          const result$ = resolvers({
            fetchJobs,
            fetchJobDetail: defaultFetchJobDetail,
            pollingInterval: m.time("--|")
          }).Query.metronomeItems({}, { filter });

          const expected$ = m.cold("--(x|)", {
            x: output
          });

          m.expect(
            result$.take(1).map(result => result.items.map(item => item.id))
          ).toBeObservable(expected$);
        })
      );
    }
  });
});

describe("JobDetail", () => {
  it(
    "polls metronome detail endpoint",
    marbles(m => {
      m.bind();
      const fetchJobDetail = (id: string) =>
        m.cold("--x|", { x: { ...defaultJobDetailData, id } });
      const result$ = resolvers({
        fetchJobs: defaultFetchJobs,
        fetchJobDetail,
        pollingInterval: m.time("--|")
      }).Query.metronomeItem({}, { id: "foo" });

      const expected$ = m.cold("----x-x-(x|)", {
        x: "foo"
      });

      m.expect(result$.take(3).map(x => x.id)).toBeObservable(expected$);
    })
  );

  it(
    "transforms the data",
    marbles(m => {
      m.bind();

      const expectedJobData = {
        id: "testid",
        name: "testid",
        description: "test description",
        cpus: 0.01,
        mem: 128,
        disk: 0,
        cmd: "sleep 10",
        schedule: null,
        docker: {},
        labels: {},
        runs: [
          {
            id: "20180606104932xsDzH",
            finishedAt: 1528282184471,
            createdAt: 1528282172336,
            status: "SUCCESS",
            runTime: 12135,
            children: []
          },
          {
            id: "20180606104545rjSRE",
            createdAt: 1528281945890,
            finishedAt: 1528281957236,
            status: "SUCCESS",
            runTime: 11346,
            children: []
          },
          {
            id: "20180606100732E88WQ",
            createdAt: 1528279652972,
            finishedAt: 1528279664265,
            status: "SUCCESS",
            runTime: 11293,
            children: []
          },
          {
            id: "20180606093146gr5Pi",
            createdAt: 1528277506254,
            finishedAt: 1528277507760,
            status: "FAILED",
            runTime: 1506,
            children: []
          }
        ]
      };

      const fetchJobs = () => m.cold("-");
      const fetchJobDetail = () => m.cold("x|", { x: defaultJobDetailData });
      const result$ = resolvers({
        fetchJobs,
        fetchJobDetail,
        pollingInterval: m.time("|")
      }).Query.metronomeItem({}, { id: "foo" });

      const expected$ = m.cold("(x|)", {
        x: expectedJobData
      });

      m.expect(result$.take(1)).toBeObservable(expected$);
    })
  );

  describe("sorting", () => {
    it("sorts by id");
    it("sorts by status");
    it("sorts by finished");
    it("sorts by run time");
  });
});
