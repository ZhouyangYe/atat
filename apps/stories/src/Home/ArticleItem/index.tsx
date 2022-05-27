import React, { Ref, useEffect, useState } from 'react';
import { IArticle } from 'atat-common/lib/services/stories'

import './index.less';

interface Params {
  width: number;
  height: number;
  top: number;
  left: number;
  article: IArticle;
}

const ArticleItem = ({ article, width, height, left, top }: Params, ref: Ref<HTMLLIElement>) => {
  const margin = 6 + width / 60;

  return (
    <li ref={ref} className='article-item' key={article.id} style={{ left, top, width: width + 12 }}>
      <div className='pic' style={{ backgroundImage: `url(${article.picture.link})`, width, height }} title={article.desc} />
      <p style={{ width, marginBottom: margin - 8, marginTop: margin, fontSize: Math.floor(12 + width / 50) }} title={article.desc}>{article.desc}</p>
    </li>
  );
};

export default React.forwardRef<HTMLLIElement, Params>(ArticleItem);
