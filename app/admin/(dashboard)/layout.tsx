import AdminSidebar from '@/components/admin/AdminSidebar'
import { requireAdminUser } from '@/lib/admin/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 px-10 py-10">{children}</main>
    </div>
  )
}
