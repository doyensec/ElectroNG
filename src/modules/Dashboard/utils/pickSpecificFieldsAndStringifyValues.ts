import * as _ from 'lodash';

export const pickSpecificFieldsAndStringifyValues = (e: any): any =>
  _.mapValues(
    _.pick(e, [
      'uuid',
      'triaged',
      'severity',
      'confidence',
      'title',
      'file',
      'fileAttr',
      'description',
      'relativeFilePath',
      'notes',
      'location'
    ]),
    (value) => `${value?.sha2 || value?.name || value?.line || value}`
  );

export const mapAndPickSpecificFieldsAndStringifyValues = (es: any): any =>
  _.map(es, (e) => pickSpecificFieldsAndStringifyValues(e));
