import _ from 'lodash';

export const getSeverityStats = (issues: any) =>
  _.reduce(
    issues,
    (acc, { severity }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acc[severity?.name?.toLowerCase()] += 1;
      return acc;
    },
    {
      low: 0,
      medium: 0,
      high: 0,
      informational: 0,
    }
  );
