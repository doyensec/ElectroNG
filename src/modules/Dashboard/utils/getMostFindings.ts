import _ from 'lodash';

export const getMostFindings = (issues: any) =>
  _.take(
    _.orderBy<any>(
      _.values(
        _.reduce(
          issues,
          (acc: any, { id, severity, title }) => {
            const severityTag: any = {
              HIGH: 'red',
              MEDIUM: 'gold',
              LOW: 'green',
              INFORMATIONAL: 'blue',
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            acc[id] !== undefined
              ? (acc[id].counter += 1)
              : (acc[id] = {
                  counter: 0,
                  title,
                  tag: {
                    color: severityTag[severity?.name ?? ''],
                    text: severity?.name ?? '',
                  },
                });

            return acc;
          },
          {}
        )
      ),
      ['counter'],
      ['desc']
    ),
    10
  );
