import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import { Dashboard } from './components/dashboard';

function App() {

  return (
    <>
      <Container>
        <Dashboard />
      </Container>
    </>
  )
}

export default App
