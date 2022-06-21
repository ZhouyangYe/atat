import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  filter?: string[];
  maxHeight?: number | string;
  minHeight?: number;
}

const SourceCode: React.FC<Params> = ({ root, filter, maxHeight = 600, minHeight = 0 }) => {
  const [loading, setLoading] = useState(true);
  const [element, setElement] = useState<FileData>();
  const [path, setPath] = useState<string | undefined>(root);
  const [fullscreen, setFullscreen] = useState(false);
  const [mHeight, setMHeight] = useState<string | number>(maxHeight);
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setMHeight(`calc(100vh - ${headerRef.current?.clientHeight}px - 28px)`);
        setFullscreen(true);
        return;
      }
      setFullscreen(false);
    };
    ref.current!.addEventListener('fullscreenchange', handleFullscreenChange, false);
  }, []);

  const content = useMemo(() => {
    if (!element) {
      return <></>;
    }

    if (element.info.isDir) {
      return (
        <>
          {element.info.files.filter((file) => (
            path === root && filter ? filter?.includes(file) : true
          )).sort((file1, file2) => {
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
    const r = <span key="root" className="path-unit" onClick={() => {
      setPath(root);
    }}>/root</span>;

    if (!path) {
      return r;
    }

    const paths = path === root ? [] : path.slice(root?.length ? root.length + 1 : 0).split('^');

    const result = paths.map((f, i) => (
      <span
        key={f}
        className="path-unit"
        onClick={() => {
          setPath(root ? `${root}^${paths.slice(0, i + 1).join('^')}` : paths.slice(0, i + 1).join('^'));
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
    const result = newPath?.join('^');
    setPath(result === '' ? undefined : result);
  }, [path]);

  const handleFullScreen = useCallback(() => {
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      if (ref.current?.requestFullscreen) {
        ref.current.requestFullscreen();
      }
    }
  }, [fullscreen]);

  return (
    <div ref={ref} className={`source-code ${fullscreen ? 'fullscreen' : ''}`}>
      <div ref={headerRef} className='header'>
        <h2><img onClick={handleFullScreen} src={`@resources/static/icons/${fullscreen ? 'fullscreen-exit': 'fullscreen'}.svg`} /><span>源码 · Souce code</span></h2>
        <div className='content'>
          <img onClick={handleBack} src="@resources/static/icons/back.svg" />
          <div className='path'>
            {links}
          </div>
        </div>
      </div>
      <div className='code' style={{ maxHeight: fullscreen ? mHeight : maxHeight, minHeight: fullscreen ? mHeight : minHeight }}>
        {loading ? <Loading /> : content}
      </div>
    </div>
  );
};

export default SourceCode;
