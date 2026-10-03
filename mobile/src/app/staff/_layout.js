import { useStore } from '@/lib/store';
import { RoleTabs } from '@/components/nav';

export default function StaffLayout() {
  const { state } = useStore();
  const enquiries = state.admissions.filter((a) => a.stage === 'Enquiry').length;
  return (
    <RoleTabs
      role="staff"
      tabs={[
        { name: 'index', title: 'Dashboard', icon: 'grid' },
        { name: 'admissions', title: 'Admissions', icon: 'clipboard', badge: enquiries },
        { name: 'students', title: 'Students', icon: 'users' },
        { name: 'attendance', title: 'Attendance', icon: 'check-square' },
        { name: 'more', title: 'More', icon: 'menu' },
      ]}
    />
  );
}
