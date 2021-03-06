/*eslint-disable*/
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Footer from '../component/common/Footer/Presentational';
import Nav from '../component/common/Navigation/Presentational';
import HeaderContainer from '../component/common/Header/Container';
import MovieCommentContainer from '../component/Moviedetail/Comment/Container';
import MovieContentContainer from '../component/Moviedetail/DetailInfo/Container';
import {
  getMovieDetail,
  initializeMovieDetail,
} from '../store/movieDetail/Reducer';
import {
  getMovieComment,
  initializeMovieComment,
} from '../store/movieCommet/Reducer';
import { ReducerType } from '../store';
import Loading from '../component/common/Loading/Presentational';
import Except from '../component/common/Except/Presentational';

const Moviedetail = () => {
  const dispatch = useDispatch();
  const { movieid } = useParams<'movieid'>();
  useLayoutEffect(() => {
    if (movieid !== undefined) {
      dispatch(getMovieDetail({ movieId: movieid }));
      dispatch(getMovieComment({ movieId: movieid }));
    }
    return () => {
      dispatch(initializeMovieDetail());
      dispatch(initializeMovieComment());
    };
  }, []);
  const movieDetailData = useSelector(
    (state: ReducerType) => state.movieDetail
  );
  const movieCommentData = useSelector(
    (state: ReducerType) => state.moiveComment
  );
  if (movieCommentData.loading || movieDetailData.loading) {
    return (
      <>
        <HeaderContainer />
        <Nav />
        <Loading />
        <Footer />
      </>
    );
  } else if (movieCommentData.error || movieDetailData.error) {
    return (
      <>
        <HeaderContainer />
        <Nav />
        <Except text="에러가 발생하였습니다" />
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <HeaderContainer />
        <Nav />
        <MovieContentContainer />
        <MovieCommentContainer />
        <Footer />
      </>
    );
  }
};

export default Moviedetail;
