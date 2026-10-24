import React from 'react';
import { Button, Card, Space } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import htmlbars from 'react-syntax-highlighter/dist/cjs/languages/hljs/htmlbars';
import { extToLang, getNineLines, getStartingLineNumber } from "../../../../utils";

const { shell } = require('electron');
const path = require('path')

interface FilePreviewCardProps {
  file: string;
  filePath: string;
  onShowMore: () => void;
}

export const FilePreviewCard = ({
  file,
  filePath,
  location,
  onShowMore,
}: FilePreviewCardProps) => (
  <Card
    title="File"
    extra={
      <Space>
        <Button
          size="small"
          onClick={() => {
            if (filePath.includes('.asar' + path.sep)) {
              // when a file is inside the asar, ElectroNg will open the folder containing the asar file
              let asarPath = filePath.substring(0, filePath.indexOf('.asar' + path.sep)) + '.asar'
              shell.showItemInFolder(asarPath);
            }
            else {
            shell.openPath(filePath);
          }
          }}
        >
          <FolderOpenOutlined />
          Open file
        </Button>
      </Space>
    }
  >
    <SyntaxHighlighter
      language={extToLang(filePath)}
      style={a11yLight}
      showLineNumbers = {showLineNumbers(file)}
      startingLineNumber={getStartingLineNumber(location)}
      lineProps={(lineNumber) => {
          const style = { display: "block", width: "fit-content" };
          if (lineNumber+1 == location) {
              style.backgroundColor = "#ffe7a4";
          }
          return { style };
      }}
      wrapLines={true}
      customStyle={{ overflow: 'hidden' }}
    >
      {getNineLines(file, location)}
    </SyntaxHighlighter>
    <Button
      type="primary"
      size="small"
      style={{ margin: 'auto', display: 'block' }}
      onClick={onShowMore}
      hidden={!showLineNumbers(file)}
    >
      Show more
    </Button>
  </Card>
);


const showLineNumbers = (file: string) => {
  // this is the constant string to prevent the UI from showing the preview of large file
  return file !== 'File is too large to be displayed'
}