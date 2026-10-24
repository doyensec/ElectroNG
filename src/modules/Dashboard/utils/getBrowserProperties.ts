import * as _ from 'lodash';

export const getBrowserProperties = (decorators: any) => {
  return _.reduce(decorators,
    (acc: any[], v: any) => {
      if (
        v.properties &&
        v.id === 'WEBPREFERENCES_JS_CHECK'
      )
        acc.push(v);
      return acc;
    },
    []
  )
};
