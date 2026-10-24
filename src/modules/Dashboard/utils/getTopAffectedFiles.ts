import _ from 'lodash';

export const getTopAffectedFiles = (issues: any) =>
  _.take(
    _.orderBy<any>(
      _.map(
        _.reduce(
          issues.filter((issue) => { return issue.file && issue.file !== "N/A" }),
          (acc: any, { file }) => {
            const shorterFileName: string = file
              .split('/')
              .splice(-2)
              .join('/');

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            acc[shorterFileName] !== undefined
              ? (acc[shorterFileName] += 1)
              : (acc[shorterFileName] = 0);

            return acc;
          },
          {}
        ),
        (counter, title) => ({ title, counter })
      ),
      ['counter'],
      ['desc']
    ),
    10
  );
