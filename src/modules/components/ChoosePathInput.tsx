import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import { ipcRenderer } from 'electron';
import { PathType } from '../../interfaces/pathType';

// let uniqueId = 0;
// eslint-disable-next-line no-plusplus
// const getUniqueId = () => uniqueId++;

export const ChoosePathInput = ({
  value = '',
  onChange = (path: string) => {
    return path;
  },
  type = null,
  fileName = '',
}: {
  value?: string;
  onChange?: (path: string) => string;
  type: PathType | null;
  fileName?: string;
}) => {
  /**
   *  Fix for
   *  "ESLint: A form label must be associated with a control.(jsx-a11y/label-has-associated-control)"
   *  See: https://gist.github.com/sqren/fc897c1629979e669714893df966b1b7
   */
  // const componentId = useRef(`input-${getUniqueId()}`).current;
  const [path, setPath] = useState(value);

  useEffect(() => {
    onChange?.(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const onClick = () => {
    return ipcRenderer.invoke(`get-${type}-path`).then((selectedPath) => {
      setPath(selectedPath);
      return selectedPath;
    });
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div style={{ display: 'flex' }} onClick={onClick}>
      <Input
        value={path + fileName}
        tabIndex={-1}
        style={{
          flex: 1,
          borderRight: 0,
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          cursor: 'pointer',
        }}
      />
      <Button>Select</Button>
    </div>
  );
};
