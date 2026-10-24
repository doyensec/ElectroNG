import React, { useState } from 'react';
import * as _ from 'lodash';
import { Button, Card, Col, List, Row, Space } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import ClampLines from 'react-clamp-lines';
import { Enumeration } from '../interfaces/Enumeration';
import { DashboardEnumerationSeverityDetails } from './DashboardEnumerationDetails/DashboardEnumerationSeverityDetails';
import { SyntaxHighlighterModal } from './DashboardEnumerationDetails/SyntaxHighlighterModal';
import { TesterNotesModal } from './DashboardEnumerationDetails/TesterNotesModal';
import { DescriptionModal } from './DashboardEnumerationDetails/DescriptionModal';
import { FilePreviewCard } from './DashboardEnumerationDetails/FilePreviewCard';
import { EnumerationDetails } from '../interfaces/EnumerationDetails';
import styles from '@Modules/Dashboard/styles/DashboardEnumerationDetails.css';

interface DashboardEnumerationDetailsProps {
  currentEnumeration: Enumeration;
  onExportDetails: () => void;
  onGetCurrentEnumerationDetails: () => Promise<string>;
  onClose: () => void;
  onSave: (details: EnumerationDetails) => void;
  onGetStoredFile: (sha2: string) => string
}

export const DashboardEnumerationDetails = ({
  currentEnumeration,
  onExportDetails,
  onGetCurrentEnumerationDetails, // currentEnumeration === finding
  onClose,
  onSave,
  onGetStoredFile
}: DashboardEnumerationDetailsProps): JSX.Element => {
  const [showMoreCode, toShowMoreCode] = useState(false);
  const [descriptionModalContent, setDescriptionModalContent] = useState('');
  const [testerNotesModalContent, setTesterNotesModalContent] = useState('');

  if (currentEnumeration.notes === "false")
    currentEnumeration.notes = "None";

  const currentEnumerationList = _.toPairs(
    _.pick(currentEnumeration, [
      'severity',
      'confidence',
      'title',
      'relativeFilePath',
      'description',
      'notes'
    ])
  );


  function wrapperOnGetStoredFile(sha2: string): string {
    // the result is not recognized as string without concatenation with empty strings
    const cont = '' + onGetStoredFile(sha2)
    return cont
  }

  const detailSection: {
    [key: string]: (value: any) => React.ReactNode;
  } = {
    severity: (enumeration) => {
      return (
        <DashboardEnumerationSeverityDetails
          severityValue={_.startCase(enumeration.severity?.toLowerCase())}
          triageValue={enumeration.triaged}
          onChange={({ severity, triage }) => {
            onSave(
              _.omitBy<EnumerationDetails>(
                {
                  notes: testerNotesModalContent,
                  severity,
                  triage,
                },
                _.isNil
              )
            );
          }}
        />
      );
    },
    confidence: (enumeration) =>
      _.startCase(enumeration.confidence?.toLowerCase()),
    description: (enumeration) => (
      <ClampLines
        text={enumeration.description}
        lessText="less"
        moreText="more"
        lines={3}
        id="dashboard_enumeration_details_description"
      />
    ),
  };

  const titles: { [key: string]: string } = {
    title: 'finding title',
    relativeFilePath: 'Affected file name',
    notes: 'tester notes',
  };

  return (
    <Row gutter={[18, 18]}>
      <Col span={24}>
        <Card
          title="Details"
          extra={
            <Space>
              <Button size="small" onClick={onExportDetails}>
                <ExportOutlined />
                Export details
              </Button>
              <Button size="small" onClick={onClose}>
                Close
              </Button>
            </Space>
          }
        >
          <List
            itemLayout="horizontal"
            className={styles.dashboardEnumerationDetailsList}
            dataSource={currentEnumerationList}
            renderItem={([key, value]) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className={styles.titleWrapper}>
                        {_.startCase(titles[key] || key)}
                        {key === 'description' && (
                          <Button
                            type="link"
                            className={styles.titleEditButton}
                            onClick={() => {
                              onGetCurrentEnumerationDetails().then(data =>
                                setDescriptionModalContent(data)
                              );
                            }
                            }
                          >
                            View
                          </Button>
                        )}
                        {key === 'notes' && (
                          <Button
                            type="link"
                            className={styles.titleEditButton}
                            onClick={() =>
                              setTesterNotesModalContent(value as string)
                            }
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    }
                    description={
                      <div className={styles.userSelectable}>
                        {detailSection[key]?.(currentEnumeration) || value}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </Col>

      <Col span={24}>
        {
          currentEnumeration.hasOwnProperty('file') &&  currentEnumeration.hasOwnProperty('fileAttr') &&
      <FilePreviewCard
          file={ wrapperOnGetStoredFile(currentEnumeration.fileAttr)}
          filePath={currentEnumeration.file}
          location={currentEnumeration.location}
          onShowMore={() => toShowMoreCode(!showMoreCode)}
        />
      }
      </Col>

      <DescriptionModal
        isVisible={!_.isEmpty(descriptionModalContent)}
        description={descriptionModalContent}
        onCancel={() => setDescriptionModalContent('')}
      />

      <TesterNotesModal
        isVisible={!_.isEmpty(testerNotesModalContent)}
        testerNotes={testerNotesModalContent}
        onOk={() => {
          onSave({
            notes: testerNotesModalContent,
          });
          setTesterNotesModalContent('');
        }}
        onCancel={() => setTesterNotesModalContent('')}
        onChange={({ target }: any) => setTesterNotesModalContent(target.value)}
      />

        {currentEnumeration.hasOwnProperty('file') &&  currentEnumeration.hasOwnProperty('fileAttr') && 
            <SyntaxHighlighterModal
        isVisible={showMoreCode /*&& currentEnumeration.file*/}
        file={ wrapperOnGetStoredFile(currentEnumeration.fileAttr)}
        filePath={currentEnumeration.file}
        location={currentEnumeration.location}
        onCancel={() => toShowMoreCode(false)}
      />
        }
    </Row>
  );
};
