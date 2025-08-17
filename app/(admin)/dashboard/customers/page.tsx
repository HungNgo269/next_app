import { FormattedCustomersTable } from "@/app/interface/customer";
import { fetchFilteredCustomers } from "@/app/lib/data";
import { sql } from "@/app/lib/db";
import CustomersTable from "@/app/ui/admin/customers/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    // sort?:S
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const customers: FormattedCustomersTable[] =
    await sql`select id,name,email,image_url,total_invoices,total_paid,created_at from users ORDER by total_paid desc `;
  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
