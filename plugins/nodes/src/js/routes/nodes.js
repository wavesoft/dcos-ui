import { injectIntl } from "react-intl";
import { IndexRoute, Route, Redirect } from "react-router";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import NodeDetailHealthTab from "../pages/nodes/NodeDetailHealthTab";
import NodeDetailPage from "../pages/nodes/NodeDetailPage";
import NodeDetailTab from "../pages/nodes/NodeDetailTab";
import NodeDetailTaskTab from "../pages/nodes/NodeDetailTaskTab";
import NodesGridContainer from "../pages/nodes/nodes-grid/NodesGridContainer";
import NodesOverview from "../pages/NodesOverview";
import NodesPage from "../pages/NodesPage";
import NodesTableContainer
  from "../pages/nodes/nodes-table/NodesTableContainer";
import NodesTaskDetailPage from "../pages/nodes/NodesTaskDetailPage";
import TaskDetailsTab
  from "../../../../services/src/js/pages/task-details/TaskDetailsTab";
import TaskFileBrowser
  from "../../../../services/src/js/pages/task-details/TaskFileBrowser";
import TaskFilesTab
  from "../../../../services/src/js/pages/task-details/TaskFilesTab";
import TaskFileViewer
  from "../../../../services/src/js/pages/task-details/TaskFileViewer";
import TaskLogsContainer
  from "../../../../services/src/js/pages/task-details/TaskLogsContainer";
import TaskVolumeContainer
  from "../../../../services/src/js/containers/volume-detail/TaskVolumeContainer";
import NodesUnitsHealthDetailPage
  from "../pages/nodes/NodesUnitsHealthDetailPage";
import VolumeTable from "../../../../services/src/js/components/VolumeTable";

const nodesRoutes = {
  type: Route,
  path: "nodes",
  component: NodesPage,
  category: "resources",
  isInSidebar: true,
  children: [
    {
      type: Route,
      component: NodesOverview,
      children: [
        {
          type: IndexRoute,
          component: NodesTableContainer
        },
        {
          type: Route,
          path: "grid",
          component: NodesGridContainer
        }
      ]
    },
    {
      type: Redirect,
      from: "/nodes/:nodeID",
      to: "/nodes/:nodeID/tasks"
    },
    {
      type: Route,
      path: ":nodeID",
      component: NodeDetailPage,
      children: [
        {
          type: Route,
          title: this.props.intl.formatMessage({
            id: "XXXX",
            defaultMessage: "Tasks"
          }),
          path: "tasks",
          component: NodeDetailTaskTab
        },
        {
          type: Redirect,
          path: "/nodes/:nodeID/tasks/:taskID",
          to: "/nodes/:nodeID/tasks/:taskID/details"
        },
        {
          type: Route,
          path: "health",
          title: this.props.intl.formatMessage({
            id: "XXXX",
            defaultMessage: "Health"
          }),
          component: NodeDetailHealthTab
        },
        {
          type: Route,
          path: "details",
          title: this.props.intl.formatMessage({
            id: "XXXX",
            defaultMessage: "Details"
          }),
          component: NodeDetailTab
        }
      ]
    },
    {
      type: Route,
      path: ":nodeID/tasks/:taskID",
      component: NodesTaskDetailPage,
      hideHeaderNavigation: true,
      children: [
        {
          type: Route,
          component: TaskDetailsTab,
          hideHeaderNavigation: true,
          title: this.props.intl.formatMessage({
            id: "XXXX",
            defaultMessage: "Details"
          }),
          path: "details",
          isTab: true
        },
        {
          hideHeaderNavigation: true,
          component: TaskFilesTab,
          isTab: true,
          path: "files",
          title: this.props.intl.formatMessage({
            id: "XXXX",
            defaultMessage: "Files"
          }),
          type: Route,
          children: [
            {
              component: TaskFileBrowser,
              fileViewerRoutePath: "/nodes/:nodeID/tasks/:taskID/files/view(/:filePath(/:innerPath))",
              hideHeaderNavigation: true,
              type: IndexRoute
            },
            {
              component: TaskFileViewer,
              hideHeaderNavigation: true,
              path: "view(/:filePath(/:innerPath))",
              type: Route
            }
          ]
        },
        {
          component: TaskLogsContainer,
          hideHeaderNavigation: true,
          isTab: true,
          path: "logs",
          title: this.props.intl.formatMessage({
            id: "XXXX",
            defaultMessage: "Logs"
          }),
          type: Route,
          children: [
            {
              path: ":filePath",
              type: Route
            }
          ]
        },
        {
          component: VolumeTable,
          hideHeaderNavigation: true,
          isTab: true,
          path: "volumes",
          title: this.props.intl.formatMessage({
            id: "XXXX",
            defaultMessage: "Volumes"
          }),
          type: Route
        }
      ]
    },
    // This route needs to be rendered outside of the tabs that are rendered
    // in the nodes-task-details route.
    {
      type: Route,
      path: ":nodeID/tasks/:taskID/volumes/:volumeID",
      component: TaskVolumeContainer
    },
    // This needs to be outside of the children array of node routes
    // so that it can be responsible for rendering its own header.
    {
      type: Route,
      path: ":nodeID/health/:unitNodeID/:unitID",
      component: NodesUnitsHealthDetailPage
    }
  ]
};

module.exports = injectIntl(nodesRoutes);
