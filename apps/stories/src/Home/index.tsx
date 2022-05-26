import React, { useEffect, useState } from 'react';
import { getArticles, IArticle } from 'atat-common/lib/services/stories'
import ArticleItem from './ArticleItem';

const Home: React.FC<any> = () => {
  const [articles, setArticles] = useState<IArticle[]>();

  useEffect(() => {
    getArticles().then((res) => {
      if (res.success) {
        setArticles(res.data);
      }
    });
  }, []);

  return (
    <div className='home'>
      <ul>
        {articles?.map((article) => (
          <ArticleItem key={article.id} article={article} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
