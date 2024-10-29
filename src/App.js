import logo from './logo.svg';
import './App.css';
import ApiDataComponent from './components/ApiData';
import NotificationComponent from './components/Quartz';

function App() {
  return (
    <div className="App">
      <ApiDataComponent></ApiDataComponent>
      <NotificationComponent></NotificationComponent>
    </div>
  );
}

export default App;
