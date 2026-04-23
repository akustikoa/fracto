import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import GroupPage from './pages/GroupPage';
import CreateGroupPage from './pages/CreateGroupPage';
import DetailsPage from './pages/DetailsPage';

export default function App() {
  const [group, setGroup] = useState(() => {
    const savedGroup = localStorage.getItem('fracto_group');

    return savedGroup ? JSON.parse(savedGroup) : null;
  });
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('fracto_expenses');

    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (group) {
      localStorage.setItem('fracto_group', JSON.stringify(group));
    } else {
      localStorage.removeItem('fracto_group');
    }
  }, [group]);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('fracto_expenses', JSON.stringify(expenses));
    } else {
      localStorage.removeItem('fracto_expenses');
    }
  }, [expenses]);

  function handleCreateGroup(newGroup) {
    setGroup(newGroup);
    setExpenses([]);
    navigate(`/group/${newGroup.id}`);
  }

  if (!group) {
    return (
      <Routes>
        <Route
          path='*'
          element={<CreateGroupPage onCreateGroup={handleCreateGroup} />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<Navigate to={`/group/${group.id}`} replace />} />
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
        element={<DetailsPage group={group} expenses={expenses} />}
      />
      <Route
        path='*'
        element={<Navigate to={`/group/${group.id}`} replace />}
      />
    </Routes>
  );
}
