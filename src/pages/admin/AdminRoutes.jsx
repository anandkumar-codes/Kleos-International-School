import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import Dashboard from './Dashboard';
import Students from './Students';
import { Parents, Teachers, Classes } from './People';
import { Attendance, Examinations, Assignments } from './AcademicsAdmin';
import { AdmissionsAdmin, Fees } from './Office';
import Content from './Content';
import { Messages, Notifications, Reports, SettingsPage } from './Comms';
import { EmptyState, Button } from '../../components/ui';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="parents" element={<Parents />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="examinations" element={<Examinations />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="admissions" element={<AdmissionsAdmin />} />
        <Route path="fees" element={<Fees />} />
        <Route path="content" element={<Content />} />
        <Route path="content/:section" element={<Content />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<EmptyState title="Page not found" text="This admin page doesn't exist." action={<Button to="/admin">Back to dashboard</Button>} />} />
      </Route>
    </Routes>
  );
}
