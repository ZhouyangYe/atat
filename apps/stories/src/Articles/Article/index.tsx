import React from 'react';
import { IArticle } from 'atat-common/lib/services/stories';

import './index.less';

interface Params {
  article: IArticle;
}

const Article: React.FC<Params> = ({ article }) => {  
  return (
    <div className='atat-article'>
      <div className='thumbnail' style={{ backgroundImage: `url(${article.thumbnail})` }}></div>
      <div className='content'>
        <h2><span>{article.title}</span></h2>
        <p><span>{article.desc}</span></p>
      </div>
    </div>
  );
};

export default Article;
