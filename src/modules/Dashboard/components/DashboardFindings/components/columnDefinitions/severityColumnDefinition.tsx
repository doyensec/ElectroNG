import React from 'react';
import { Tag } from 'antd';
import * as _ from 'lodash';
import { SeverityColors } from '../../../../../../constants/SeverityColors';

export const severityColumnDefinition = () => ({
         title: 'Severity',
         key: 'severity',
         dataIndex: ['severity'],
         sorter: (a: { severity: string }, b: { severity: any }) =>
           a.severity.localeCompare(b.severity),
         render: (severity: string) => (
           <Tag
             color={SeverityColors[severity?.toLowerCase()]}
             className="no-select"
             key={severity}
             style={{ cursor: 'pointer', margin: 0 }}
           >
             {_.startCase(severity?.toLowerCase())}
           </Tag>
         ),
       });
