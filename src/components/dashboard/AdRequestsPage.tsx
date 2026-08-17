import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Eye
} from 'lucide-react';

interface AdRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  placement: 'Homepage Banner' | 'Sponsored Article' | 'Newsletter Sponsor' | 'Sidebar Sticky';
  budget: string;
  dateSubmitted: string;
  startDate: string;
  duration: string;
  targetMarket: string;
  status: 'pending' | 'approved' | 'declined';
  notes: string;
}

const INITIAL_REQUESTS: AdRequest[] = [
  {
    id: 'ad-101',
    companyName: 'BankMed Lebanon',
    contactName: 'Rami Touma',
    email: 'rami.t@bankmed.com.lb',
    placement: 'Homepage Banner',
    budget: '$4,500',
    dateSubmitted: 'Today, 2:15 PM',
    startDate: 'Sep 1, 2026',
    duration: '30 Days',
    targetMarket: 'Lebanon & Diaspora',
    status: 'pending',
    notes: 'Promoting our new expat investment account with dedicated digital banner placements.',
  },
  {
    id: 'ad-102',
    companyName: 'Bratislava Tech Summit',
    contactName: 'Michal Novak',
    email: 'michal@techsummit.sk',
    placement: 'Sponsored Article',
    budget: '$2,800',
    dateSubmitted: 'Yesterday',
    startDate: 'Aug 25, 2026',
    duration: 'One-off + Social',
    targetMarket: 'Slovakia & Tech',
    status: 'pending',
    notes: 'Feature story on central European startups expanding to the Middle East.',
  },
  {
    id: 'ad-103',
    companyName: 'Riyadh Seasons Tourism',
    contactName: 'Fahad Al-Harbi',
    email: 'fahad@riyadhseasons.sa',
    placement: 'Sidebar Sticky',
    budget: '$8,000',
    dateSubmitted: 'Aug 12, 2026',
    startDate: 'Oct 1, 2026',
    duration: '60 Days',
    targetMarket: 'Saudi Arabia & Gulf',
    status: 'pending',
    notes: 'Destination marketing campaign targeting travelers across the Arab region.',
  },
  {
    id: 'ad-104',
    companyName: 'Dubai Fintech Week',
    contactName: 'Sarah Jenkins',
    email: 'sarah.j@dubaifintech.ae',
    placement: 'Newsletter Sponsor',
    budget: '$3,200',
    dateSubmitted: 'Aug 10, 2026',
    startDate: 'Sep 15, 2026',
    duration: '4 Issues',
    targetMarket: 'UAE & Tech',
    status: 'pending',
    notes: 'Header takeover in The961 Morning Brief for 4 consecutive weeks.',
  },
  {
    id: 'ad-105',
    companyName: 'Almaza Brewery',
    contactName: 'Ziad Chemali',
    email: 'z.chemali@almaza.com.lb',
    placement: 'Homepage Banner',
    budget: '$5,000',
    dateSubmitted: 'Aug 05, 2026',
    startDate: 'Aug 15, 2026',
    duration: '30 Days',
    targetMarket: 'Lebanon',
    status: 'approved',
    notes: 'Summer campaign promoting local craft edition.',
  },
];

export default function AdRequestsPage() {
  const [requests, setRequests] = useState<AdRequest[]>(INITIAL_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const handleUpdateStatus = (id: string, status: 'approved' | 'declined') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status } : null);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'pending', 'approved', 'declined'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab === 'pending' ? `Pending (${pendingCount})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/70 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pl-6 pr-4 py-3.5">Advertiser</th>
                <th className="px-4 py-3.5">Placement</th>
                <th className="px-4 py-3.5">Target Market</th>
                <th className="px-4 py-3.5">Budget</th>
                <th className="px-4 py-3.5">Start Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="pr-6 pl-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 text-xs">
                    No ad requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="pl-6 pr-4 py-4">
                      <span className="font-semibold text-gray-900 block">{req.companyName}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-800">{req.placement}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {req.targetMarket}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {req.budget}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {req.startDate}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        req.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="pr-6 pl-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          title="View proposal details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(req.id, 'approved')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Approve request"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(req.id, 'declined')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Decline request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedRequest.companyName}</h3>
                <p className="text-xs text-gray-400">Ad Proposal #{selectedRequest.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl">
                <div>
                  <span className="text-gray-400 block text-[10px]">Contact Person</span>
                  <span className="font-semibold text-gray-900">{selectedRequest.contactName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Email</span>
                  <span className="font-semibold text-gray-900">{selectedRequest.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Placement</span>
                  <span className="font-semibold text-gray-900">{selectedRequest.placement}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Proposed Budget</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedRequest.budget}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Campaign Period</span>
                  <span className="font-medium text-gray-900">{selectedRequest.startDate} ({selectedRequest.duration})</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Target Region</span>
                  <span className="font-medium text-gray-900">{selectedRequest.targetMarket}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 font-semibold block mb-1">Campaign Description / Notes</span>
                <p className="text-gray-700 bg-gray-50 p-3.5 rounded-xl leading-relaxed">
                  {selectedRequest.notes}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'declined')}
                    className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                    className="px-5 py-2 text-xs font-semibold bg-[#FF0000] hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Approve Proposal
                  </button>
                </>
              )}
              {selectedRequest.status !== 'pending' && (
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
