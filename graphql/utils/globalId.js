export const toGlobalId = (type, id) => [type, id].join(':');

export const fromGlobalId = (globalId) => {
  const delimiterPos = globalId.indexOf(':');

  return {
    type: globalId.substring(0, delimiterPos),
    id: globalId.substring(delimiterPos + 1)
  };
}
