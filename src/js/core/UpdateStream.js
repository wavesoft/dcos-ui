import { Observable } from "rxjs/Observable";
import UserSettingsStore from "#SRC/js/stores/UserSettingsStore";
import { request } from "@dcos/http-service";
import Util from "#SRC/js/utils/Util";
import { SAVED_STATE_KEY } from "#SRC/js/constants/UserSettings";
import compareVersions from "compare-versions";

const CHECK_DELAY = 24 * 60 * 60 * 1000; // Once every 24 hours
const DCOS_UI_VERSION = "dcosUIVersion";

export const UpdateStreamType = Symbol("UpdateStreamType");

function getFromLocalStorage(key) {
  const value = Util.findNestedPropertyInObject(
    UserSettingsStore.getKey(SAVED_STATE_KEY),
    DCOS_UI_VERSION + "." + key
  );

  return value;
}

function setInLocalStorage(key, value) {
  const savedStates = UserSettingsStore.getKey(SAVED_STATE_KEY) || {};
  savedStates[DCOS_UI_VERSION] = {
    dismissedVersion: getFromLocalStorage("dismissedVersion") || null,
    lastTimeCheck: getFromLocalStorage("lastTimeCheck") || null
  };
  savedStates[DCOS_UI_VERSION][key] = value;
  UserSettingsStore.setKey(SAVED_STATE_KEY, savedStates);
}

function getContentType({ action, actionType, entity, version }) {
  return `application/vnd.dcos.${entity}.${action}-${actionType}+json;charset=utf-8;version=${version}`;
}

function showNotification(newVersion) {
  // TODO: show notification
  // When dismissing, save dismissed version in local storage
  const currentVersion = window.DCOS_UI_VERSION;
  console.log(
    "A new version of DCOS UI is available. Upgrade " +
      currentVersion +
      " to " +
      newVersion +
      ". Dismiss."
  );
}

setInLocalStorage("dismissedVersion", "2.24.2"); // stub
const dismissedVersion = Observable.of(
  getFromLocalStorage("dismissedVersion") || "0"
);

const fetchedVersion = request("/package/list-versions", {
  method: "POST",

  headers: {
    "Content-Type": getContentType({
      action: "list-versions",
      actionType: "request",
      entity: "package",
      version: "v1"
    }),
    Accept: getContentType({
      action: "list-versions",
      actionType: "response",
      entity: "package",
      version: "v1"
    })
  },
  body: JSON.stringify({ includePackageVersions: true, packageName: "dcos-ui" })
}).retry(4);

export const compare = Observable.timer(0, CHECK_DELAY).switchMap(() =>
  Observable.combineLatest(
    dismissedVersion,
    fetchedVersion,
    (dismissedVersion, newVersionObject) => {
      if (
        new Date().getTime() <
        getFromLocalStorage("lastTimeCheck") + CHECK_DELAY
      ) {
        return;
      }
      setInLocalStorage("lastTimeCheck", new Date().getTime());
      const newVersion = Object.keys(newVersionObject.response.results)[0];
      if (compareVersions(newVersion, dismissedVersion) === 1) {
        return newVersion;
      }

      return false;
    }
  )
);

compare.subscribe(value => {
  if (value) {
    showNotification(value);
  }
});
