  import { Navigate, Route, Routes } from 'react-router-dom';
  import GroupPage from './pages/GroupPage';
  import CreateGroupPage from './pages/CreateGroupPage';
  import DetailsPage from './pages/DetailsPage';
  import SharePage from './pages/SharePage';
  import ScrollToTop from './components/ScrollToTop';
  import Footer from './components/Footer';

  export default function App() {
    function handleCreateGroup() {
      return null;
    }

    return (
      <div className='flex min-h-screen flex-col bg-zinc-50'>
        <div className='flex-1'>
          <ScrollToTop />
          <Routes>
            <Route
              path='/'
              element={<CreateGroupPage onCreateGroup={handleCreateGroup} />}
            />
            <Route
              path='/group/:id'
              element={<GroupPage />}
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
        </div>
        <Footer />
      </div>
    );
  }
