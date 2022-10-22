
import { Route, Routes } from 'react-router-dom';
import { useQuery } from '@apollo/client'
import { Home } from './pages/Home';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';
import { GET_CURRENT_USER } from './graphql/query';
function App() {

  const { data: current } = useQuery(GET_CURRENT_USER);
  return (
    <Routes>
      <Route path='/' element={<Home current_user={current?.currentUser} />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/chat/:id' element={<ChatPage current={current?.currentUser} />} />
    </Routes>
  );
}

export default App;
