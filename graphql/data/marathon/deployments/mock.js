import mockResponse from './mock-data/groups';

export default class MockGroupsConnector {
  getGroups() {
    return Promise.resolve(mockResponse);
  }

  getGroupsById(groupId) {
    // Find group by Id in MockResponse
    let group = {};

    return Promise.resolve(group);
  }
}
