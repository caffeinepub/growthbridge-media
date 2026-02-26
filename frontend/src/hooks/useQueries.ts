import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  InfluencerApplication,
  BrandInquiry,
  Campaign,
  UserProfile,
} from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Admin Check ─────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Influencer Applications ─────────────────────────────────────────────────

export function useSubmitInfluencerApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (app: InfluencerApplication) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInfluencerApplication(app);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allInfluencers'] });
    },
  });
}

export function useGetAllInfluencers() {
  const { actor, isFetching } = useActor();

  return useQuery<InfluencerApplication[]>({
    queryKey: ['allInfluencers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInfluencers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveInfluencer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveInfluencer(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allInfluencers'] });
    },
  });
}

// ─── Brand Inquiries ──────────────────────────────────────────────────────────

export function useSubmitBrandInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiry: BrandInquiry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitBrandInquiry(inquiry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBrands'] });
    },
  });
}

export function useGetAllBrands() {
  const { actor, isFetching } = useActor();

  return useQuery<BrandInquiry[]>({
    queryKey: ['allBrands'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBrands();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export function useGetAllCampaigns() {
  const { actor, isFetching } = useActor();

  return useQuery<Campaign[]>({
    queryKey: ['allCampaigns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: Campaign) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCampaign(campaign);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['aggregateStats'] });
    },
  });
}

export function useUpdateCampaignStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, status }: { campaignId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCampaignStatus(campaignId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCampaigns'] });
    },
  });
}

export function useUpdateCampaignDealValue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, dealValue }: { campaignId: bigint; dealValue: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCampaignDealValue(campaignId, dealValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['aggregateStats'] });
    },
  });
}

// ─── Aggregate Stats ──────────────────────────────────────────────────────────

export function useGetAggregateStats() {
  const { actor, isFetching } = useActor();

  return useQuery<{ totalDealValue: bigint; totalCommission: bigint }>({
    queryKey: ['aggregateStats'],
    queryFn: async () => {
      if (!actor) return { totalDealValue: BigInt(0), totalCommission: BigInt(0) };
      return actor.getAggregateStats();
    },
    enabled: !!actor && !isFetching,
  });
}
