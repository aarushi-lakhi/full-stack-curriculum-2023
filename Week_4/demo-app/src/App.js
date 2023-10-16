import logo from './logo.svg';
import './App.css';
import Greeting from './Greeting'

function App() {

  let name = "TPEO!"
  const names = ["TPEO", "me", "you"] 


  return (
    <div className="App">
      <header className="App-header">
        
        <p> Hello World</p>

        <p>Hello {name} </p>

        {names.map((name, index) => <Greeting name={name} key={index}></Greeting>)}

      </header>
    </div>
  );
}

export default App;
