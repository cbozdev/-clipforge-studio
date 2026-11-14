import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import EditorPage from './pages/EditorPage';
import Settings from './pages/Settings';
import Planned from './pages/Planned';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="new" element={<NewProject />} />
        <Route path="project/:id" element={<EditorPage />} />
        <Route path="clipper" element={<Planned title="AI Auto Clipper" stage="Stage 8" note="Needs transcription (Stage 7) first. It will rank moments using transcript, audio energy and silence, and show why each moment scored." />} />
        <Route path="templates" element={<Planned title="Templates" stage="Stage 10" note="Templates set aspect ratio, caption placement and text styles once the editor and captions exist." />} />
        <Route path="exports" element={<Planned title="Exported videos" stage="Stage 11" note="Export history appears here after the FFmpeg export engine is built." />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
