/*eslint-disable*/

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NullComponent from '../component/common/NullComponent';
import SortedPosterList from '../component/Sortedmovie/RankPosterList';
import { RootState } from '../modules';
import imagePreload from '../lib/imagePreload';
const PosterListContainer = () => {
  const data = useSelector((state: RootState) => state.sortedMovieInfo);
  let orderdata = localStorage.getItem('order');
  if (orderdata == null) {
    localStorage.setItem('order', '인기순');
    orderdata = '인기순';
  }
  useEffect(() => {
    if (data.popular[0].title !== 'default') {
      const orderdataname =
        orderdata === '인기순' ? data.topRated : data.popular;
      orderdataname.forEach((data) => {
        imagePreload(data.posterPath);
      });
    }
  }, [data]);
  //이미지를 미리 로드합니다.

  return data.popular[0].title === 'default' ? (
    <NullComponent text={'로딩중'}></NullComponent>
  ) : (
    <SortedPosterList
      popular={data.popular}
      topRated={data.topRated}
      orderdata={orderdata}
    />
  );
};

export default PosterListContainer;
