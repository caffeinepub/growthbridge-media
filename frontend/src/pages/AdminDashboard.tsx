import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useGetAllInfluencers,
  useGetAllBrands,
  useGetAllCampaigns,
  useGetAggregateStats,
  useApproveInfluencer,
  useCreateCampaign,
  useUpdateCampaignStatus,
  useUpdateCampaignDealValue,
} from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import {
  Loader2,
  Users,
  Briefcase,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import type { Campaign } from '../backend';

type Tab = 'influencers' | 'brands' | 'campaigns' | 'stats';

const STATUS_OPTIONS = ['Pending', 'Active', 'Completed', 'Cancelled'];

// ─── Inline-editable campaign row ────────────────────────────────────────────

function CampaignRow({
  campaign,
  onUpdateStatus,
  onUpdateDealValue,
}: {
  campaign: Campaign;
  onUpdateStatus: (status: string) => void;
  onUpdateDealValue: (dealValue: number) => void;
}) {
  const [editingDeal, setEditingDeal] = useState(false);
  const [dealInput, setDealInput] = useState(Number(campaign.dealValue).toString());

  const statusColors: Record<string, string> = {
    Active: 'bg-teal-50 text-teal-700',
    Pending: 'bg-amber-50 text-amber-700',
    Completed: 'bg-slate-100 text-slate-600',
    Cancelled: 'bg-red-50 text-red-600',
  };

  const handleDealSave = () => {
    const val = Number(dealInput);
    if (!isNaN(val) && val >= 0) {
      onUpdateDealValue(val);
    }
    setEditingDeal(false);
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 text-slate-400 text-xs">#{campaign.id.toString()}</td>
      <td className="px-6 py-4 text-slate-600">{campaign.brandId.toString()}</td>
      <td className="px-6 py-4 text-slate-600">{campaign.influencerId.toString()}</td>
      <td className="px-6 py-4">
        {editingDeal ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              value={dealInput}
              onChange={(e) => setDealInput(e.target.value)}
              className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDealSave();
                if (e.key === 'Escape') setEditingDeal(false);
              }}
            />
            <button
              onClick={handleDealSave}
              className="p-1 text-teal-600 hover:bg-teal-50 rounded"
              aria-label="Save deal value"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setDealInput(Number(campaign.dealValue).toString()); setEditingDeal(false); }}
              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
              aria-label="Cancel edit"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-800 font-medium">{Number(campaign.dealValue).toLocaleString()}</span>
            <button
              onClick={() => setEditingDeal(true)}
              className="p-1 text-slate-300 hover:text-teal-600 rounded transition-colors"
              aria-label="Edit deal value"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-amber-600 font-medium">
        {Number(campaign.commission).toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[campaign.status] ?? 'bg-slate-100 text-slate-600'}`}>
          {campaign.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <select
          value={campaign.status}
          onChange={(e) => onUpdateStatus(e.target.value)}
          className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
          aria-label={`Update status for campaign ${campaign.id.toString()}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}

// ─── Main AdminDashboard component ───────────────────────────────────────────

export default function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('influencers');

  // Data queries
  const { data: influencers = [], isLoading: infLoading, refetch: refetchInf } = useGetAllInfluencers();
  const { data: brands = [], isLoading: brandsLoading, refetch: refetchBrands } = useGetAllBrands();
  const { data: campaigns = [], isLoading: campLoading, refetch: refetchCamp } = useGetAllCampaigns();
  const { data: stats, isLoading: statsLoading } = useGetAggregateStats();

  // Mutations
  const { mutate: approveInfluencer, isPending: approvingInfluencer } = useApproveInfluencer();
  const { mutateAsync: createCampaign, isPending: creatingCampaign } = useCreateCampaign();
  const { mutate: updateStatus } = useUpdateCampaignStatus();
  const { mutate: updateDealValue } = useUpdateCampaignDealValue();

  // Campaign creation form state
  const [newCampaign, setNewCampaign] = useState({
    brandId: '',
    influencerId: '',
    dealValue: '',
    status: 'Pending',
  });
  const [campaignError, setCampaignError] = useState('');

  // ── Auth / admin guard ──
  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  // ── Campaign creation handler ──
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.brandId || !newCampaign.influencerId || !newCampaign.dealValue) {
      setCampaignError('Brand ID, Influencer ID, and Deal Value are required');
      return;
    }
    try {
      const campaign: Campaign = {
        id: BigInt(0),
        brandId: BigInt(Number(newCampaign.brandId)),
        influencerId: BigInt(Number(newCampaign.influencerId)),
        dealValue: BigInt(Number(newCampaign.dealValue)),
        commission: BigInt(0),
        status: newCampaign.status,
        createdAt: BigInt(0),
      };
      await createCampaign(campaign);
      setNewCampaign({ brandId: '', influencerId: '', dealValue: '', status: 'Pending' });
      setCampaignError('');
    } catch {
      setCampaignError('Failed to create campaign. Please try again.');
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'influencers', label: 'Influencers', icon: <Users className="w-4 h-4" />, count: influencers.length },
    { id: 'brands', label: 'Brand Inquiries', icon: <Briefcase className="w-4 h-4" />, count: brands.length },
    { id: 'campaigns', label: 'Campaigns', icon: <TrendingUp className="w-4 h-4" />, count: campaigns.length },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage influencers, brands, and campaigns</p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Influencers Tab ── */}
        {activeTab === 'influencers' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Influencer Applications</h2>
              <button
                onClick={() => refetchInf()}
                className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Refresh influencers"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {infLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : influencers.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No influencer applications yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Handle</th>
                      <th className="px-6 py-3 text-left">Niche</th>
                      <th className="px-6 py-3 text-left">Followers</th>
                      <th className="px-6 py-3 text-left">Engagement</th>
                      <th className="px-6 py-3 text-left">Location</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {influencers.map((inf) => (
                      <tr key={inf.id.toString()} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{inf.fullName}</td>
                        <td className="px-6 py-4 text-slate-500">@{inf.instagramHandle}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                            {inf.niche}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{Number(inf.followersCount).toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600">{Number(inf.engagementRate)}%</td>
                        <td className="px-6 py-4 text-slate-500">{inf.location}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              inf.approved ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {inf.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveInfluencer({ id: inf.id, approved: true })}
                              disabled={inf.approved || approvingInfluencer}
                              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label={`Approve ${inf.fullName}`}
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => approveInfluencer({ id: inf.id, approved: false })}
                              disabled={!inf.approved || approvingInfluencer}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label={`Reject ${inf.fullName}`}
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Brands Tab ── */}
        {activeTab === 'brands' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Brand Inquiries</h2>
              <button
                onClick={() => refetchBrands()}
                className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Refresh brands"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {brandsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No brand inquiries yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">Brand</th>
                      <th className="px-6 py-3 text-left">Industry</th>
                      <th className="px-6 py-3 text-left">Contact</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Budget</th>
                      <th className="px-6 py-3 text-left">Timeline</th>
                      <th className="px-6 py-3 text-left">Goal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {brands.map((brand) => (
                      <tr key={brand.id.toString()} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-400 text-xs">#{brand.id.toString()}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{brand.brandName}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                            {brand.industry}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{brand.contactName}</td>
                        <td className="px-6 py-4 text-slate-500">{brand.email}</td>
                        <td className="px-6 py-4 text-slate-600">{brand.budgetRange}</td>
                        <td className="px-6 py-4 text-slate-500">{brand.timeline}</td>
                        <td
                          className="px-6 py-4 text-slate-500 max-w-xs truncate"
                          title={brand.campaignGoal}
                        >
                          {brand.campaignGoal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Campaigns Tab ── */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Create Campaign Form */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-600" />
                Create New Campaign
              </h2>
              <form onSubmit={handleCreateCampaign} noValidate>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label htmlFor="camp-brandId" className="block text-xs font-semibold text-slate-600 mb-1">
                      Brand ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="camp-brandId"
                      type="number"
                      min="1"
                      value={newCampaign.brandId}
                      onChange={(e) => setNewCampaign((p) => ({ ...p, brandId: e.target.value }))}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="camp-influencerId" className="block text-xs font-semibold text-slate-600 mb-1">
                      Influencer ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="camp-influencerId"
                      type="number"
                      min="1"
                      value={newCampaign.influencerId}
                      onChange={(e) => setNewCampaign((p) => ({ ...p, influencerId: e.target.value }))}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="camp-dealValue" className="block text-xs font-semibold text-slate-600 mb-1">
                      Deal Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="camp-dealValue"
                      type="number"
                      min="0"
                      value={newCampaign.dealValue}
                      onChange={(e) => setNewCampaign((p) => ({ ...p, dealValue: e.target.value }))}
                      placeholder="e.g. 100000"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="camp-status" className="block text-xs font-semibold text-slate-600 mb-1">
                      Status
                    </label>
                    <select
                      id="camp-status"
                      value={newCampaign.status}
                      onChange={(e) => setNewCampaign((p) => ({ ...p, status: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {campaignError && (
                  <p className="text-xs text-red-600 mb-3" role="alert">{campaignError}</p>
                )}
                <button
                  type="submit"
                  disabled={creatingCampaign}
                  className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {creatingCampaign ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create Campaign
                </button>
              </form>
            </div>

            {/* Campaigns List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">All Campaigns</h2>
                <button
                  onClick={() => refetchCamp()}
                  className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-50 transition-colors"
                  aria-label="Refresh campaigns"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {campLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No campaigns yet. Create one above.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">Brand ID</th>
                        <th className="px-6 py-3 text-left">Influencer ID</th>
                        <th className="px-6 py-3 text-left">Deal Value</th>
                        <th className="px-6 py-3 text-left">Commission (20%)</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {campaigns.map((camp) => (
                        <CampaignRow
                          key={camp.id.toString()}
                          campaign={camp}
                          onUpdateStatus={(status) => updateStatus({ campaignId: camp.id, status })}
                          onUpdateDealValue={(dealValue) =>
                            updateDealValue({ campaignId: camp.id, dealValue: BigInt(dealValue) })
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Stats Tab ── */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {statsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-7 h-7 text-teal-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Total Deal Value
                    </p>
                    <p className="text-4xl font-extrabold text-slate-900">
                      {Number(stats?.totalDealValue ?? 0).toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">Across all campaigns</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-7 h-7 text-amber-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Total Commission Earned
                    </p>
                    <p className="text-4xl font-extrabold text-amber-600">
                      {Number(stats?.totalCommission ?? 0).toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">20% of total deal value</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                  <h3 className="font-bold text-slate-900 mb-6">Campaign Overview</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Campaigns', value: campaigns.length, color: 'text-teal-600' },
                      {
                        label: 'Active',
                        value: campaigns.filter((c) => c.status === 'Active').length,
                        color: 'text-teal-600',
                      },
                      {
                        label: 'Completed',
                        value: campaigns.filter((c) => c.status === 'Completed').length,
                        color: 'text-amber-600',
                      },
                      {
                        label: 'Approved Influencers',
                        value: influencers.filter((i) => i.approved).length,
                        color: 'text-teal-600',
                      },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className={`text-3xl font-extrabold ${item.color} mb-1`}>{item.value}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
