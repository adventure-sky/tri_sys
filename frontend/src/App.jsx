import { useState } from 'react';
import Login from './components/Login';
import MainMenu from './components/MainMenu';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }
  return <MainMenu user={user} onLogout={() => setUser(null)} />;
}

export default App;
