import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { Card, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { Enumeration } from '../interfaces/Enumeration';
import { severityColumnDefinition } from './columnDefinitions/severityColumnDefinition';
import { confidenceColumnDefinition } from './columnDefinitions/confidenceColumnDefinition';
import { titleColumnDefinition } from './columnDefinitions/titleColumnDefinition';
import { affectedFileColumnDefinition } from './columnDefinitions/affectedFileColumnDefinition';
import {
  filterEnumerationsBy,
  mapAndPickSpecificFieldsAndStringifyValues,
  pickSpecificFieldsAndStringifyValues,
} from '../../../utils';
import { searchFiledColumnDefinition } from './columnDefinitions/searchFiledColumnDefinition';
import { triageColumnDefinition } from './columnDefinitions/triageColumnDefinition';

interface DashboardEnumerationTableProps {
  enumerationsRaw: any;
  setCurrentEnumeration: Dispatch<SetStateAction<Enumeration | null>>;
  isEnumerationSelected: boolean;
}

export const DashboardEnumerationTable = ({
  enumerationsRaw,
  setCurrentEnumeration,
  isEnumerationSelected,
}: DashboardEnumerationTableProps): JSX.Element => {
  const [enumerations, setEnumeration] = useState<Array<any>>();
  const [columnDefinitions, setColumnDefinitions] = useState<
    ColumnsType<any>
  >();

  useEffect(() => {
    setEnumeration(mapAndPickSpecificFieldsAndStringifyValues(enumerationsRaw));
  }, [enumerationsRaw]);

  useEffect(() => {
    setColumnDefinitions(
      _.compact([
        !isEnumerationSelected && triageColumnDefinition(),
        !isEnumerationSelected && severityColumnDefinition(),
        !isEnumerationSelected && confidenceColumnDefinition(),
        titleColumnDefinition(), // Default column
        affectedFileColumnDefinition(), // Default column
        !isEnumerationSelected &&
          searchFiledColumnDefinition(
            ({ target }: any) =>
              setEnumeration(
                target?.value
                  ? filterEnumerationsBy(enumerationsRaw, target.value)
                  : mapAndPickSpecificFieldsAndStringifyValues(enumerationsRaw)
              ),
            (record: any) => () => setCurrentEnumeration(record)
          ),
      ])
    );
  }, [isEnumerationSelected]);

  return (
    <Card title="List of findings">
      <Table
        columns={columnDefinitions}
        dataSource={enumerations}
        pagination={{ pageSize: 12, showSizeChanger: false }}
        rowClassName="selectable selectableText"
        onRow={(record) => ({
          onClick: () =>
            setCurrentEnumeration(pickSpecificFieldsAndStringifyValues(record)),
        })}
      />
    </Card>
  );
};
