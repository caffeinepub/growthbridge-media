import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InfluencerApplication {
    id: bigint;
    portfolioLink: string;
    followersCount: bigint;
    createdAt: Time;
    instagramHandle: string;
    fullName: string;
    engagementRate: bigint;
    email: string;
    approved: boolean;
    niche: string;
    location: string;
    rateCard: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type Time = bigint;
export interface Campaign {
    id: bigint;
    status: string;
    createdAt: Time;
    commission: bigint;
    brandId: bigint;
    dealValue: bigint;
    influencerId: bigint;
}
export interface BrandInquiry {
    id: bigint;
    contactName: string;
    createdAt: Time;
    email: string;
    website: string;
    brandName: string;
    campaignGoal: string;
    budgetRange: string;
    industry: string;
    timeline: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveInfluencer(id: bigint, approved: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCampaign(campaign: Campaign): Promise<void>;
    getAggregateStats(): Promise<{
        totalCommission: bigint;
        totalDealValue: bigint;
    }>;
    getAllBrands(): Promise<Array<BrandInquiry>>;
    getAllCampaigns(): Promise<Array<Campaign>>;
    getAllInfluencers(): Promise<Array<InfluencerApplication>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isInfluencerApproved(influencerId: bigint): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitBrandInquiry(inquiry: BrandInquiry): Promise<void>;
    submitInfluencerApplication(app: InfluencerApplication): Promise<void>;
    updateCampaignDealValue(campaignId: bigint, dealValue: bigint): Promise<void>;
    updateCampaignStatus(campaignId: bigint, status: string): Promise<void>;
}
