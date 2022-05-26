import React, { useEffect, useState } from 'react';
import { IArticle } from 'atat-common/lib/services/stories'

import './index.less';

interface Params {
  article: IArticle;
}

const ArticleItem: React.FC<Params> = ({ article }) => {
  return (
    <li className='article-item' key={article.id}>
      <div className='pic' style={{ backgroundImage: `url(${article.picture.link})`, width: 280, height: 280 * article.picture.ratio }} />
      <p>{article.desc}</p>
    </li>
  );
};

export default ArticleItem;
