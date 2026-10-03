import { RoleTabs } from '@/components/nav';

export default function GuestLayout() {
  return (
    <RoleTabs
      role="guest"
      requireRole={false}
      tabs={[
        { name: 'index', title: 'Home', icon: 'home' },
        { name: 'admissions', title: 'Admissions', icon: 'edit-3' },
        { name: 'gallery', title: 'Gallery', icon: 'image' },
        { name: 'contact', title: 'Contact', icon: 'phone' },
      ]}
    />
  );
}
