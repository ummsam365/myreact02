import './TodoList.css';
import TodoItem from './TodoItem';
import { useState, useMemo, useContext } from 'react';
import { TodoContext } from '../App';

export default function TodoList() {

  //** Context 적용 : useContext()
  const {todo} = useContext(TodoContext);


  // ** 검색기능 추가 (content 기준)
  //=> 검색어처리를 위한 상태변수 search, onChange 이벤트핸들러 추가
  //=> 검색어 필터링 기능 함수작성 : getSearchResult
  const [search, setSearch] = useState('');
  const onChangeSearch = (e) => { setSearch(e.target.value) };
  
  //=> filter 적용 필터링
  //  - 검색어 입력하지않은경우 : todo 그대로 출력
  //  - 검색어 입력한경우 : 필터링
  const getSearchResult = () => {
    return  search==='' ? todo :
             todo.filter(({content}) => content.toLowerCase().includes(search.toLowerCase()) );
  }

  // ** 분석 통계 기능 추가
  //=> todo 의 데이터 총갯수(배열길이)
  //   완료갯수 (isDone_true) : todo.filter 결과인 배열의 길이
  //   미완료갯수 (isDone_false) : 전체 - 완료
  //=> 분석함수 정의
  const analyzeTodo = () => {
    console.log(`** analyzeTodo 호출 !!! **`);
    const totalCount = todo.length;
    const doneCount = todo.filter((it) => it.isDone).length;
    const notCount = totalCount - doneCount;
    return { totalCount, doneCount, notCount }
  }; //analyzeTodo
  //=> 최적화 적용 이전
  //const {totalCount, doneCount, notCount} = analyzeTodo();

  //** 분석함수에 최적화 적용
  //=> todo 에 변화가 없는 경우 (검색하는경우) 에는
  //   재계산을 할 필요가 없지만, 랜더링과 동시에 무조건 호출됨
  //=> todo 에 변화가 있는 경우 (재계산이 필요한 경우) 에만 호출되도록함
  //=> 함수의 최적화, useMemo()
  //  const value = useMemo(callBack, [의존성배열])
  const {totalCount, doneCount, notCount} = useMemo(analyzeTodo, [todo]);

  console.log(`** TodoList Update !!! **`);
  return (
    <div className='TodoList'>
      <h3>🎃 TodoList 🤩</h3>
      {/* 분석통계 */}
      <div>
        <div>* 총일정 갯수: {totalCount}</div>
        <div>* 완료된 일정: {doneCount}</div>
        <div>* 미완료 일정: {notCount}</div>
      </div>
      {/* 검색, input에서 type 생략시 default 값은 text */}
      <input className='searchBar'
            value={search} 
            onChange={onChangeSearch}
            placeholder='검색어를 입력하세요~' /> 
      <div className='list_wrapper'>
        {/* * Context 적용으로 현재행의 Data(item) 만 전달하면 됨 */}
        { getSearchResult().map((it)=> <TodoItem key={it.id} {...it} />) }
      </div>
    </div>
  ); //return
} //TodoList