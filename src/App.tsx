import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer, Header } from './components/Layout';
import BankPage from './pages/Bank';
import ExamPage from './pages/Exam';
import HistoryPage from './pages/History';
import HomePage from './pages/Home';
import ResultPage from './pages/Result';
import ReviewPage from './pages/Review';
import NotFoundPage from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exam/:paperId" element={<ExamPage />} />
          <Route path="/result/:attemptId" element={<ResultPage />} />
          <Route path="/review/:attemptId" element={<ReviewPage />} />
          <Route path="/bank" element={<BankPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
