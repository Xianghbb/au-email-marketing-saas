import { getCompanyDbClient } from '@/lib/db/company-client';
import LeadsFilters from '@/components/leads/LeadsFilters';
import LeadsTable from '@/components/leads/LeadsTable';

interface Company {
  listing_id: string;
  company_name: string;
  category_name: string | null;
  email: string | null;
  phone_number: string | null;
  address_suburb: string | null;
  address_state: string | null;
  address_postcode: string | null;
}

async function getLeads(searchQuery?: string, cityQuery?: string, industryQuery?: string): Promise<Company[]> {
  const supabase = getCompanyDbClient();

  // Force no cache on the query
  let query = supabase
    .from('rawdata_yellowpage_new')
    .select('listing_id, company_name, category_name, email, phone_number, address_suburb, address_state, address_postcode');

  // Apply search query filter (company_name)
  if (searchQuery && searchQuery.trim()) {
    const searchTerm = `%${searchQuery.trim()}%`;
    query = query.ilike('company_name', searchTerm);
  }

  // Apply city filter (search in address_suburb)
  if (cityQuery && cityQuery.trim()) {
    const cityTerm = `%${cityQuery.trim()}%`;
    query = query.ilike('address_suburb', cityTerm);
  }

  // Apply industry filter (exact match on category_name)
  if (industryQuery && industryQuery.trim() && industryQuery !== 'all') {
    query = query.eq('category_name', industryQuery.trim());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return data || [];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { query?: string; city?: string; industry?: string };
}) {
  const searchQuery = searchParams?.query;
  const cityQuery = searchParams?.city;
  const industryQuery = searchParams?.industry;

  const leads = await getLeads(searchQuery, cityQuery, industryQuery);

  // Build active filters summary
  const activeFilters: string[] = [];
  if (searchQuery) activeFilters.push(`Name: "${searchQuery}"`);
  if (cityQuery) activeFilters.push(`City: "${cityQuery}"`);
  if (industryQuery && industryQuery !== 'all') activeFilters.push(`Industry: "${industryQuery}"`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Business Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search and browse Australian businesses
          </p>
        </div>
        <LeadsFilters />
      </div>

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Active filters:</span>{' '}
          {activeFilters.join(' • ')}
        </div>
      )}

      {/* Results Summary */}
      {(searchQuery || cityQuery || (industryQuery && industryQuery !== 'all')) && (
        <div className="text-sm text-gray-600">
          {leads.length > 0
            ? `Found ${leads.length} result${leads.length === 1 ? '' : 's'}`
            : 'No results found'}
        </div>
      )}

      {/* Table */}
      <LeadsTable leads={leads} activeFilters={activeFilters} />
    </div>
  );
}
