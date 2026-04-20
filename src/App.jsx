import { useState } from 'react';
import GroupPage from './pages/GroupPage';
import CreateGroupPage from './pages/CreateGroupPage';

export default function App() {
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);

  function handleCreateGroup(newGroup) {
    setGroup(newGroup);
    setExpenses([]);
  }

  if (!group) {
    return <CreateGroupPage onCreateGroup={handleCreateGroup} />;
  }

  return (
    <GroupPage group={group} expenses={expenses} setExpenses={setExpenses} />
  );
}
