'use client';

import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Check, CheckSquare, Square } from 'lucide-react';
import AddToCollectionModal from './AddToCollectionModal';

interface Company {
  id: string;
  name: string;
  categories: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  listingTpye: string | null;
}

interface LeadsTableProps {
  leads: Company[];
  activeFilters?: string[];
}

export default function LeadsTable({ leads, activeFilters = [] }: LeadsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((lead) => lead.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectedCompanies = leads
    .filter((lead) => selectedIds.has(lead.id))
    .map((lead) => ({ id: lead.id, name: lead.name }));

  const handleSaveSuccess = () => {
    setSelectedIds(new Set());
    // Optionally refresh data or show success message
  };

  const isAllSelected = leads.length > 0 && selectedIds.size === leads.length;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < leads.length;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {leads.length > 0 ? (
          <>
            {/* Floating Action Bar */}
            {selectedIds.size > 0 && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
                <div className="bg-blue-600 text-white rounded-lg shadow-lg px-6 py-3 flex items-center gap-4">
                  <span className="font-medium">
                    {selectedIds.size} selected
                  </span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Save to Collection
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-blue-100 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={toggleSelectAll}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isAllSelected ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : isPartiallySelected ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((company) => (
                    <tr
                      key={company.id}
                      className={`hover:bg-gray-50 ${
                        selectedIds.has(company.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleSelectOne(company.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {selectedIds.has(company.id) ? (
                            <CheckSquare className="h-5 w-5" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{company.categories || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {company.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              <a
                                href={`mailto:${company.email}`}
                                className="hover:text-blue-600 truncate max-w-[200px]"
                              >
                                {company.email}
                              </a>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <a
                                href={`tel:${company.phone}`}
                                className="hover:text-blue-600"
                              >
                                {company.phone}
                              </a>
                            </div>
                          )}
                          {!company.email && !company.phone && (
                            <div className="text-sm text-gray-400">No contact info</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {company.address ? (
                          <div className="flex items-start text-sm text-gray-600 max-w-xs">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="truncate">{company.address}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {company.listingTpye || 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedIds(new Set([company.id]));
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {activeFilters.length > 0 ? 'No leads found' : 'No leads yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilters.length > 0
                ? 'Try adjusting your search criteria'
                : 'Use the filters above to find business leads'}
            </p>
          </div>
        )}
      </div>

      {/* Add to Collection Modal */}
      <AddToCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCompanyIds={Array.from(selectedIds)}
        selectedCompanies={selectedCompanies}
        onSuccess={handleSaveSuccess}
      />
    </>
  );
}
