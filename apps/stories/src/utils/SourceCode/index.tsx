import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getFileInfo, IFileInfo } from 'atat-common/lib/services/stories';
import message from 'atat-common/lib/modules/message';
import { EXT, getExt } from 'atat-common/lib/utils';
import { Loading } from '@/utils';
import File from './File';
import Code from './Code';

import './index.less';

interface FileData {
  info: IFileInfo;
  ext: string;
}

interface Params {
  root?: string;
  maxHeight?: number;
  minHeight?: number;
}

const SourceCode: React.FC<Params> = ({ root, maxHeight = 600, minHeight = 0 }) => {
  const [loading, setLoading] = useState(true);
  const [element, setElement] = useState<FileData>();
  const [path, setPath] = useState<string | undefined>(root);

  const content = useMemo(() => {
    if (!element) {
      return <></>;
    }

    if (element.info.isDir) {
      return (
        <>
          {element.info.files.sort((file1, file2) => {
            const ext1 = getExt(file1), ext2 = getExt(file2);

            if (ext1 === ext2) {
              return 0;
            }

            if (ext1 === EXT.NONE) {
              return -1;
            }

            return 1;
          }).map((file) => (
            <File key={file} onclick={() => {
              setPath(path ? `${path}^${file}` : file);
            }} filename={file} ext={getExt(file)} />
          ))}
        </>
      )
    } else {
      return (
        <Code data={element.info.data} ext={element.ext} />
      );
    }
  }, [element]);

  const links = useMemo(() => {
    const r = <span key="root" className="path" onClick={() => {
      setPath(root);
    }}>/root</span>;

    if (!path) {
      return r;
    }

    const paths = path.slice(root?.length || 0).split('^');

    const result = paths.map((f, i) => (
      <span
        key={f}
        className="path"
        onClick={() => {
          setPath(paths.slice(0, i + 1).join('^'));
        }}
      >/{f}</span>
    ));
    result.unshift(r);

    return result;
  }, [path]);

  useEffect(() => {
    setLoading(true);
    getFileInfo({ path }).then((res) => {
      if (res.success) {
        setElement({
          info: res.data,
          ext: getExt(path || 'root'),
        });
      } else {
        setElement({
          info: {
            isDir: false,
            data: '无法显示。 Unavailable.',
            files: [],
          },
          ext: EXT.UNKNOWN,
        });
        message.error('Failed to get file info.');
      }

      setLoading(false);
    }).catch(() => {
      setElement({
        info: {
          isDir: false,
          data: '无法显示。 Unavailable.',
          files: [],
        },
        ext: EXT.UNKNOWN,
      });
      message.error('Failed to get file info.');
      setLoading(false);
    });
  }, [path]);

  const handleBack = useCallback(() => {
    if (path === root) {
      return;
    }

    let newPath = path?.split('^');
    if (newPath?.length) {
      newPath.pop();
    } else {
      newPath = undefined;
    }
    setPath(newPath?.join('^'));
  }, [path]);

  return (
    <div className='source-code'>
      <div className='header'>
        <h2>源码 · Souce code</h2>
        <div className='content'>
          <img onClick={handleBack} src="@resources/static/icons/back.svg" />
          {links}
        </div>
      </div>
      <div className='code' style={{ maxHeight, minHeight }}>
        {loading ? <Loading /> : content}
      </div>
    </div>
  );
};

export default SourceCode;
