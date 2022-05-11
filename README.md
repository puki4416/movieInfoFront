# 1.소개

간단한 영화 소개 사이트입니다. 디자인과 기능은 네이버, 다음, 넷플릭스, 왓챠, 웨이브를 참고하였습니다. 영화 정보 는 TMDB에서 제공하는 open api를 사용하였습니다.

사이트: https://movieuse.netlify.app

# 2.기술스택

- typescript: 동적 언어인 js 를 보완하여 런타임 이전에 오류를 발견할수 있도록 하기위해서 사용하였습니다.
- react: spa 웹을 만들기위해서 사용하였습니다.
- redux: 전역 상태 관리를 위해서 사용하였습니다.
- redux-saga: api데이터를 받아오기 위해서 사용하였습니다.
- styled-component: js 파일내에 css 를 작성하기위해서 사용하였습니다.
- axios: api 데이터를 받아오기 위해서 사용하였습니다.
- 반응형 웹: 모바일 사이즈인 500px을 기준으로 이보다 작으면 모바일에 맞는 사이즈로 사이트를 구성하였습니다.

# 3.페이지별 소개

5개 종류의 페이지가 존재합니다.

<p align="center"><img src="https://user-images.githubusercontent.com/102564722/161413357-7410a74d-b801-473d-b632-b0d1588135ca.gif"></p>

## 홈

- 상영중인 영화중에서 첫번째 영화의 예고편이 제일위에 재생됩니다.
- 상영중인영화, 개봉예정영화가 아래에 로드됩니다.
- 포스터에 마우스를 올리면 영화 줄거리를, 클릭하게되면 영화의 상세정보를 볼수 있습니다.

## 랭킹

- 인기순,별점순으로 정렬할수 있는 버튼과, 버튼에 따라 포스터가 로드됩니다.
- 포스터에 마우스를 올리면 영화 줄거리를, 클릭하게되면 영화의 상세정보를 볼수 있습니다.

## 영화 검색

- 인풋박스를 클릭하면 최근검색어가 나옵니다.
- 영화제목을 검색하고, 검색아이콘을 클릭하면 결과가 아래에 렌더링됩니다.
- 결과 포스터를 클릭하면 영화의 상세정보를 볼수 있습니다.
- api에서 제공하는 검색결과가 2페이지 이상일경우 아래에 페이지네이션이 구현되어 있어 다른 숫자를 클릭하면 정보를 다시 받아옵니다.

## 나만의영화

- 영화 상세정보에서 옆의 별표를 클릭해서 저장한 즐겨찾기 영화가 표시됩니다.
- 포스터를 클릭하면 상세 정보로 이동할수 있습니다.
- 로컬 스토리지에 저장되어있어서 한번 저장하면 삭제하기 이전까지 정보가 유지됩니다.
- 영화 갯수가 20개가 넘어가면 한번에 렌더링 하지 않고, 먼저 20개를 렌더링한후 스크롤을 내리면 추가적으로 10개씩 영화가 렌더링 됩니다.
- 드래그앤 드롭을 사용하여 즐겨찾기한 영화를 삭제할수 있습니다.

## 영화상세정보

- 영화 포스터, 상세정보, 요약이 윗쪽에 렌더링됩니다.
- 별모양을 클릭하면 즐겨찾기를 할수 있습니다. 이때 별이 채워지면 즐겨찾기가되고, 비워지면 해제됩니다.
- 아래에는 댓글을 달수 있습니다. 댓글을 달면 영화별로 로컬스토리지에 저장되며, x표시를 누르면 해당댓글을 삭제할수 있습니다.

# 4.주요코드 정리(코드가 많아 타입스크립트는 되도록 생략하였습니다.)

## 1. 무한 스크롤

react-intersection-observer 라이브러리를 사용해서 무한스크롤을 나만의 영화 페이지에 구현하였습니다. 이 라이브러리는 리액트 요소에 ref를 담아놓으면 이 요소가 화면에 보일때, 보이지 않을때 view 값의 불리언이 바뀌기 때문에 대략 10번째 항목마다 ref에 값을 담아두고, view값이 변화할때 마다 요소를 추가해주는 로직을 구현하면 무한스크롤을 만들어낼수 있습니다.

```javascript
src/component/FavoriteMovie.tsx
  ...
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      if (localData.length > end) {
        if (localData.length < end + 10) {
          setEnd(localData.length);
        } else {
          setEnd((end) => end + 10);
        }
      }
    }
  }, [inView]);
  // 즐겨찾기 항목의 무한 슬라이드 구현을위해 작성한 코드입니다. 10번째 항목이 화면에 보여질때 마다 항목이 10개씩 추가됩니다.

  useEffect(() => {
    if (localData !== null && localData.length < 10 && localData.length !== 0) {
      setEnd(localData.length);
    }
  }, [localData]);
  // 처음 렌더링시 항목이 10개보다 작을경우에 end의 초기값을 재설정하기위한 코드입니다.

  ...
  <Content
    ref={(index + 1) % 10 === 0 ? ref : null}
    key={data.id}
    to={`/moviedetail/${data.id}`}
    first={index}
   >
  ...
```

## 2. 이미지 preloading

처음에 home의 포스터 리스트를 제작하였을때, 다음 포스터를 얻기위해 화살표를 누르면 다음 포스터들이 바로 로딩되지 않고, 일정시간후에 로딩되는것이 사용자 경험에 좋지 않다고 생각하여서 처음 5개의 포스터를 렌더링할때 미리 나머지 포스터도 로드하여 쿠키에 저장해 놓는 함수를 만들어 사용하였습니다.

```javascript
src/lib/imagePreload.ts, src/container/RankPosterListContainer.tsx

function imagePreload(url) {
  const img = new Image();
  img.src = `https://image.tmdb.org/t/p/w500${url}`;
}
//preload 하는 함수 입니다.

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

...
```

## 3. 리덕스를 사용하여 데이터를 담고, api를 호출

api를 호출하여 정보를 받고, 이를 스토어에 저장하는 코드는 여러종류이지만, 로직은 동일하여 한가지 로직만 정리하고자 합니다. 먼저 액션타입을 선언하고, 액션 생성함수를 만듭니다. 이후 액션이 불리게되면 리덕스 사가의 제네레이터 함수에의해 api를 가져올때까지 기다린후 리듀서로 정보를 수정해 스토어에 정보를 담게 됩니다. 타입스크립트는 생략하였습니다.

```javascript
src/module/sortedmovie.ts

const GET_SORTEDMOVIE = 'sortedmovie/GET_SORTEDMOVIE' as const;
const GET_SORTEDMOVIE_SUCCESS = 'sortedmovie/GET_SORTEDMOVIE_SUCCESS' as const;
const GET_SORTEDMOVIE_FAILURE = 'sortedmovie/GET_SORTEDMOVIE_FAILURE' as const;
//액션 생성

export const getSortedMovie = () => ({
  type: GET_SORTEDMOVIE,
});

const getSortedMovieSuccess = (sortedMovie: any) => ({
  type: GET_SORTEDMOVIE_SUCCESS,
  payload: {
    data: sortedMovie.data,
  },
});
const getSortedMovieFailure = (e) => ({
  type: GET_SORTEDMOVIE_FAILURE,
  payload: e,
  error: true,
});

//액션 생성자 함수

function* getSortedMovieSaga() {
  try {
    const sortedMovie = yield call(getsortedmovie);

    yield put(getSortedMovieSuccess(sortedMovie));
  } catch (e) {
    yield put(getSortedMovieFailure(e));
    throw e;
  }
}
export function* SortedMovieSaga() {
  yield takeLatest(GET_SORTEDMOVIE, getSortedMovieSaga);
}
//리덕스 사가 미들웨어


const initialState = {
  popular: [
    ...
  ],
  topRated: [
    ...
  ],
};

const sortedMovieInfo = (
  state = initialState,
  action
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_SORTEDMOVIE_SUCCESS:
        ...
        break;
      case GET_SORTEDMOVIE_FAILURE:
       ..
    }
  });

//리듀서 함수 사용

```

## 4.페이지 나갈때,

개별 영화정보나, 검색결과등을 페이지를 나갈때 초기화 시켜주지 않으면 다음번에 접속할때 이전에 접속한 화면이 정보를 받아오는동안 실행되었습니다. 이를 해결하기위해서 리덕스스토어를 초기화하는 액션을 만들고, 이를 useEffect의 클린업 기능을 사용해 해결하였습니다.

```javascript
src / container / SearchResultContainer.tsx;

useEffect(() => {
  return () => {
    dispatch(initializeMovieSearchResult());
  };
}, []);
```

## 5.드래그 앤 드롭 api를 사용하여 즐겨찾기 삭제하기

즐겨찾기 페이지에는 삭제 기능이 없어서, 이를 드래그앤 드롭 api를 사용하여 삭제기능을 구현하였습니다. 리액트에서 사용할수 있는 라이브러리가 있었지만, 간단한 기능이므로 사용하지 않고 브라우저에서 제공하는 api를 이용하여 만들었습니다. 기능은 포스터를 드래그하면 아래에서 상자가 나와서 이 상자안에 넣으면 삭제되는 기능입니다. 이때 드래그한 포스터의 정보를 얻기 위해서 dataTransfer객체에 데이터의 인덱스 정보를 저장하여 이후 삭제할때 이 데이터를 참고하였습니다.

```javascript
src/container/FavoriteMovieContainer.tsx, src/component/FavoriteMovie.tsx

 const [deleteBox, setDeleteBox] = useState(false); //드래그 시작시 , 취소시 드롭공간 on off 하기위한 값
  const [boxOver, setBoxOver] = useState('false'); //드래그 요소 드랍공간에 올라올시 투명도 관리를 위한 값

  const dragStart = (e: any) => {
    setDeleteBox(!deleteBox);
    e.dataTransfer.setData('text/plain', e.currentTarget.name);
  };
  //드래그 시작시 드래그 요소의 인덱스를 dataTransfer객체에 저장한다.

  const dragEnd = (e) => {
    setDeleteBox(!deleteBox);
  };
  //드래그가 드롭공간이 아닌곳에서 끝나면 드롭박스를 감춘다

  const dropPoster = (e) => {
    setDeleteBox(!deleteBox);
    const Data = localData.filter((data, index) => {
      if (index == e.dataTransfer.getData('text/plain')) {
        return false;
      } else {
        return true;
      }
    });
    localStorage.setItem('favoriteMovie', JSON.stringify(Data));
    setlocalData(Data);
  };
  //드래그가 드롭공간에 드롭될경우 해당되는 인덱스의 데이터를 배열에서 삭제한뒤, state와 localstorage에 저장한다.

  const dragOver = (e) => {
    e.preventDefault();
    setBoxOver('true');
  };
  //드롭요소위에 올라갈경우 투명도를 낮춰서 드롭요소위에 올라갔음을 직관적으로알려준다.

  const dropLeave = () => {
    setBoxOver('false');
  };
  //드롭요소에서 벗어날경우 투명도를 높여준다.
  <Content
    name={index}
    draggable
    onDragStart={dragStart}
    onDragEnd={dragEnd}
  />
  ...
  <DeleteBox
    active={deleteBox}
    ref={deleteBoxTag}
    draggable
    onDrop={dropPoster}
    onDragOver={dragOver}
    Content={boxOver}
    onDragLeave={dropLeave}
  />
//렌더링 하고자하는 컨텐츠와 삭제가능한 드롭박스 영역입니다.
```

## 6.post, get 방식의 api 요청

open api를 호출해주는 서버를 따로 두고있어 이 서버를 호출할때, 최소한의 보안을 위해서 데이터가 필요한경우 쿼리 대신 body안에 값을 담아서 호출하였습니다. body안에 값을 담는다고 해도 암호화하지않으면 의미가 없지만, 최소한의 보안이라고 생각했기때문에 POST를 사용하였습니다.

```javascript
src/lib/api.ts

axios.post(
    `${process.env.REACT_APP_PROXY}/.netlify/functions/nowshowingvideo`,
    JSON.stringify({ id: id }),
    {
      headers: { 'Content-Type': `application/json` },
    }
```

## 7.로딩시 화면

처음 컨테이너 컴포넌트에서 값을 받아오면 초기값을 받아오는데, 이 값을 받아온뒤, 데이터를 받아오기 까지 시간이 걸리므로, 이시간을 표현하는 로딩화면을 구성하였습니다.

```javascript
src/component/HomePosterList.tsx

result[0].title === 'default'
            ? result.map((data, index) => {
                return (
                  <NullPosterBlock key={index}>
                    <MovieImg src={nullmovie} alt="x" />
                  </NullPosterBlock>
                );
              })
```

# 5. 코드 작성시 발생한 문제 해결 사례

## 1.CORS & api 키 보안

처음 로컬에서 api데이터를 받아올때 발생한 cors 오류는 package.json에 proxy속성에 주소를 추가하여 proxy서버를 설정하는 간단한 방법으로 해결하였습니다.

하지만, 이는 개발시에만 적용할수 있는 방법으로, 결국 배포를 위해 빌드할때 문제가 발생하였습니다. 구글링을 통해서 내린 결론은 결국 서버가 필요하다는 판단이었습니다. 서버로 호출하게 되면, 서버와 서버 사이에는 cors 가 발생하지 않으므로 문제가 해결되고, 덤으로 api키가 프론트측에서 담아 보내면 노출되는데, 서버에서 호출하게되면 프론트단에 노출되지 않아 보안의 효과까지 거둘수 있어, 간단한 서버를 만들기로 하였습니다.

서버를 만들어본경험이 없어서 최대한 동작만 하는 서버를 비슷하게 만들려고 하다가, netlify에서 간단하게 serverless function 을 제공하여 이를 이용하여 더 간단하게 만들어보고자 하였습니다. 구글에서 찾아본 예제는 전부 get으로 요청하는 방식 뿐이었지만 get과 post 방식이 크게 다르지 않을것이라고 생각하여 그대로 작성하였으나, 계속 cors오류가 발생했습니다. 추가적으로 찾아본 결과 post의 body에 데이터를 담아서 전송하는 경우에는 simple request 가 아닌 preflight를 사용하여 예비전송을 한번 시행함을 알게 되었습니다. 따라서 서버에서 이를 처리해주는 로직을 추가하여 cors 문제를 해결할수 있었습니다.

## 2.useEffect 의존성 배열

영화 상세페이지에서 즐겨찾기기능을 구현하는 도중, 빈별을 클릭하면 별이 채워지면서 로컬스토리지에 저장은되는데, 다시 영화 상세페이지로 들어와보면 즐겨찾기 별이 채워져있지 않았습니다. 로컬스토리지에는 저장되어 있는데 표시가 안되는 원인을 찾아보니, 실제 데이터는 리렌더링시 받아오게 되는데, useEffect의 의존성 배열을 비워 마운트시에만 실행되었기에, 기본값을 참고하여 항상 비어있었던것 입니다. 간단하게 의존성배열에 데이터를 담은 변수를 넣어 문제를 해결하였지만, useEffect를 사용할때, 의존성 배열의 사용을 최대한 줄이고, 사용시 로직에 대해서 충분히 이해한뒤 사용해야 함을 느꼈습니다.

# 6 프로젝트를 진행하며 느낀점

## 1. 코드 폴더 구성

리액트 파일은 크게 컴포넌트, 컨테이너, 모듈, 페이지 폴더(다른폴더도 있지만, 메인은 이 네폴더입니다.)로 구성되어있습니다. 컨테이너 폴더에는 컨테이너 컴포넌트가 들어있고, 컴포넌트 폴더에는 프레젠테이션 컴포넌트가 들어있습니다. ui와 관련된 로직은 프레젠테이션에, 이외의 데이터를 받아오거나 다른 부수효과는 컨테이너 컴포넌트에 작성하려고 노력하였습니다. 모듈폴더에는 리덕스 파일이 들어있고 페이지 폴더는 라우터가 렌더링 하는 페이지 입니다.

이번 프로젝트를 진행할때는 ui와 관련된 코드만 프레젠테이션 컴포넌트에 최대한 담아볼려고 노력하였습니다. 기능을 구현할때도 ui를 구성하는 부분과 데이터를 처리하는 부분이 같이 있으니, 생각보다 복잡하였기 때문입니다. 이렇게 분류를 해두니 확실히 데이터를 처리할때는 컨테이너 폴더를 찾고, ui를 처리할때는 프레젠테이션 컴포넌트를 찾게 되어 이후 유지보수할때 편리했습니다.

## 2. 코드 중복 제거

코드를 리팩토링할때 가장 신경을 많이 쓴부분이 코드 중복을 제거하는것이었습니다. 처음에 원하는 기능을 만들고자 코드를 작성할때는 일단 기능만 작동하게되면 넘어갔기에 생각보다 코드를 중복해서 작성한것이 많았습니다. 대표적인것이 배열의 요소를 하나하나 jsx로 작성한것입니다. 이것을 배열의 map을 사용하게 되니 코드가 굉장히 간단해지고 가독성이 크게 올라가 읽기에 좋았습니다.

또한 프로젝트를 진행하던 중에 styled-component 에서 공통 값을 관리할수 있음을 알게되었습니다. context api기반이라 사용하기 편리하기는 하였지만, 당장 공통으로 적용할만한 값이 생각이 안나서 일단 배경색만 적용시켜 두었습니다. 앞으로 공통값을 관리할때 이 기능을 활용하면 유지보수시에 굉장히 편리할 것같다는 생각을 하였습니다.

## 3. 타입스크립트

이번 프로젝트를 진행하면서 처음으로 타입스크립트를 적용해 보았습니다. 기존에 다른 정적타입 언어를 배운적이 없어서 타입을 할당한다는것이 다소 생소했지만, 간단하게나마 적용해보니 객체의 프로퍼티에 접근할때도 프로퍼티의 이름을 잘못 적어서 실수하는 경우를 바로잡아주고, 값을 할당할때도 잘못할당하는것을 방지해줘서 코드작성시에 많은 도움을 주었습니다. 지금은 비록 타입스크립트에 능숙하지 않아서 any타입을 많이 사용하였지만, 타입정의를 좀더 촘촘하게 한다면 런타임시에 발생할 오류를 줄이는데 많은 도움을 줄것 같다는 생각을 하였습니다.

# 7. 버전 개선 기록

## 1.0.0

- 파일을 처음 빌드 하였습니다.

## 1.1.0

- home 페이지에서 포스터를 움직인뒤 다른 페이지 이동후 다시 돌아올때, 이동전에 포스터리스트를 보여주도록 수정
- 드래그앤 드롭 api 를 활용하여 즐겨찾기 페이지에서 즐겨찾기 항목 삭제 가능
- 페이지네이션이 최대 5개만 출력되게하고 버튼을 통해 다음 페이지로 이동하도록 구현
- 최근검색어를 클릭하였을때 검색되도록 개선
- html 태그를 조금더 시멘틱한 태그로 의미에 맞게 수정

## 1.1.1

- api 요청을 필요한 만큼만 하도록 수정하여 렌더링 성능을 향상시켰습니다.

## 1.1.2

- 사용하지 않는 라이브러리를 정리하였습니다.
- 그림파일 확장자를 변환하여 렌더링 성능을 향상시켰습니다.
- 랭킹을 정렬 방법을 선택하는 버튼을 토글버튼으로 변경하였습니다.