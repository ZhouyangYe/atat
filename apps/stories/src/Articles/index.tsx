import React, { useEffect, useMemo, useState } from 'react';
import { getArticles, IArticle } from 'atat-common/lib/services/stories';
import BasePage from '@/BasePage';
import { Loading } from '@/utils';
import Article from './Article';

import './index.less';

const Articles: React.FC<any> = () => {
  const [articles, setArticles] = useState<IArticle[]>();

  useEffect(() => {
    getArticles().then((res) => {
      if (res.success) {
        setArticles(res.data);
      }
    });
  }, []);

  const list = useMemo(() => {
    if (articles) {
      return articles.map((article) => {
        return (
          <Article key={article.id} article={article} />
        );
      });
    }
    return <Loading />;
  }, [articles]);

  return (
    <BasePage className='articles'>
      {list}
    </BasePage>
  );
};

export default Articles;
