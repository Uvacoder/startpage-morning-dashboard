import './App.scss'
import Calendar from './components/calendar/Calendar'
import News from './components/news/News'
import TodoList from './components/todoList/TodoList'
import Weather from './components/weather/Weather'

function App() {

  return (
    <div className="App">
      <Weather/>
      <Calendar/>
      <TodoList/>
      <News/>
    </div>
  )
}

export default App
