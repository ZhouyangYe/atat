import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getArticles, IArticle } from 'atat-common/lib/services/stories';
import Menu from './Menu';
import ArticleItem from './ArticleItem';

import './index.less';

let columns: number[] = [];
let shortest = 0;
let longest = 0;

const Home: React.FC<any> = () => {
  const [articles, setArticles] = useState<IArticle[]>();
  const [panelWidth, setPanelWidth] = useState<number>();
  const [width, setWidth] = useState<number>(200);
  const [height, setHeight] = useState<number>(0);
  const [items, setItems] = useState<React.ReactElement[]>();
  const panelRef = useRef<HTMLUListElement>(null);
  const articleRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    getArticles().then((res) => {
      if (res.success) {
        setArticles(res.data);
      }
    });

    const handleResize = () => {
      if (panelRef.current) setPanelWidth(panelRef.current.clientWidth);
    };
    window.addEventListener('resize', handleResize, false);

    return () => {
      window.removeEventListener('resize', handleResize, false);
    };
  }, []);

  useEffect(() => {
    if (panelWidth && articles) {
      const list = articles.map((article, i) => {
        const padding = 6, margin = 30, titleHeight = 52;
        const picWidth = width - padding * 2, picHeight = picWidth * article.picture.ratio;
        const columnNum = Math.trunc(Math.abs(panelWidth - width) / (width + margin) + 1), gap = Math.floor((panelWidth - columnNum * width) / (columnNum - 1));
        
        if (i === 0) {
          columns = (new Array(columnNum)).fill(0);
          shortest = 0;
          longest = 0;
        } else {
          columns.forEach((c, i) => {
            if (c < columns[shortest]) {
              shortest = i;
            }
            
            if (c > columns[longest]) {
              longest = i;
            }
          });
        }

        const left = columnNum === 1 ? (panelWidth - width) / 2 : shortest * (width + gap), top = columns[shortest];

        columns[shortest] += picHeight + titleHeight + padding * 2 + margin;

        if (columns[shortest] > columns[longest]) {
          longest = shortest;
        }

        return <ArticleItem ref={articleRef} key={article.id} article={article} width={picWidth} height={picHeight} left={left} top={top} />;
      });

      setHeight(columns[longest]);
      setItems(list);
    }
  }, [panelWidth, articles, width]);

  useLayoutEffect(() => {
    setPanelWidth(panelRef.current?.clientWidth);
  }, []);

  return (
    <div className='home'>
      <Menu width={width} setWidth={setWidth} panelWidth={panelWidth} />
      <ul ref={panelRef} style={{ height }}>
        {items}
      </ul>
    </div>
  );
};

export default Home;
