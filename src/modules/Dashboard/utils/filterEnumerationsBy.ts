import * as _ from 'lodash';
import { mapAndPickSpecificFieldsAndStringifyValues } from './pickSpecificFieldsAndStringifyValues';

export const filterEnumerationsBy = (
  enumerationsRaw: any,
  searchPhrase: string
) =>
  _.filter(
    mapAndPickSpecificFieldsAndStringifyValues(enumerationsRaw),
    (enumeration) =>
      _.some(_.values(enumeration), (value: string) =>
        value?.toLowerCase().includes(searchPhrase?.toLowerCase())
      )
  );
