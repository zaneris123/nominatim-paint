import './App.css';
import PageAppBar from './components/appBar';
import MapBase from './components/map/mapBase';

export default function App() {
  return (
    <div className="App">
      <PageAppBar/>
      <MapBase/>
    </div>
  );
}