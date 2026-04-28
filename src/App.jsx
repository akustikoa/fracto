import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import GroupPage from './pages/GroupPage';
import CreateGroupPage from './pages/CreateGroupPage';
import DetailsPage from './pages/DetailsPage';
import SharePage from './pages/SharePage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);

  function handleCreateGroup(newGroup) {
    setGroup(newGroup);
    setExpenses([]);
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path='/'
          element={<CreateGroupPage onCreateGroup={handleCreateGroup} />}
        />
        <Route
          path='/group/:id'
          element={
            <GroupPage
              group={group}
              setGroup={setGroup}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          }
        />
        <Route
          path='/details/:id'
          element={<DetailsPage />}
        />
        <Route
          path='/share/:id'
          element={<SharePage />}
        />
        <Route
          path='*'
          element={<Navigate to='/' replace />}
        />
      </Routes>
    </>
  );
}
