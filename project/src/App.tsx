import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { PatientList } from '@/pages/PatientList';
import { PatientProfile } from '@/pages/PatientProfile';
import { Appointments } from '@/pages/Appointments';
import { Reports } from '@/pages/Reports';
import { Medications } from '@/pages/Medications';
import { LabResults } from '@/pages/LabResults';
import { Messages } from '@/pages/Messages';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="medications" element={<Medications />} />
          <Route path="lab-results" element={<LabResults />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
