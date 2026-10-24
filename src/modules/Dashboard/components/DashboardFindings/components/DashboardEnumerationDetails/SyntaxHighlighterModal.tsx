import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Modal } from 'antd';
import React from 'react';
import { extToLang, getStartingLineNumber } from "../../../../utils";
import javascript from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import htmlbars from 'react-syntax-highlighter/dist/cjs/languages/hljs/htmlbars';

export const SyntaxHighlighterModal = ({ isVisible, onCancel, file, filePath, location }) => (
  <Modal
    title={filePath}
    visible={isVisible}
    wrapLines={true}
    style={{ width: 300 }}
    width="calc(100% - 50px)"
    destroyOnClose
    footer={null}
    onCancel={onCancel}
  >
    <SyntaxHighlighter
      language={extToLang(filePath)}
      style={a11yLight}
      showLineNumbers
      wrapLines={true}
      lineProps={(lineNumber) => {
        const style = { display: "block", width: "fit-content" };
        console.log(lineNumber, location);
        if (lineNumber == +location) {
            style.backgroundColor = "#ffe7a4";
        }
        return { style };
      }}>
      {file}
    </SyntaxHighlighter>
  </Modal>
);
