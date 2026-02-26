import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import UserApproval "user-approval/approval";

actor {
  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type InfluencerApplication = {
    id : Nat;
    fullName : Text;
    instagramHandle : Text;
    followersCount : Nat;
    niche : Text;
    engagementRate : Nat;
    email : Text;
    location : Text;
    rateCard : Text;
    portfolioLink : Text;
    approved : Bool;
    createdAt : Time.Time;
  };

  public type BrandInquiry = {
    id : Nat;
    brandName : Text;
    industry : Text;
    website : Text;
    contactName : Text;
    email : Text;
    budgetRange : Text;
    campaignGoal : Text;
    timeline : Text;
    createdAt : Time.Time;
  };

  public type Campaign = {
    id : Nat;
    brandId : Nat;
    influencerId : Nat;
    dealValue : Nat;
    commission : Nat;
    status : Text;
    createdAt : Time.Time;
  };

  // Comparison modules for sorting
  module BrandInquiryOrd {
    public func compare(b1 : BrandInquiry, b2 : BrandInquiry) : Order.Order {
      Nat.compare(b1.id, b2.id);
    };
  };

  module InfluencerApplicationOrd {
    public func compare(i1 : InfluencerApplication, i2 : InfluencerApplication) : Order.Order {
      Nat.compare(i1.id, i2.id);
    };
  };

  module CampaignOrd {
    public func compare(c1 : Campaign, c2 : Campaign) : Order.Order {
      Nat.compare(c1.id, c2.id);
    };
  };

  // Persistent state
  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  var nextInfluencerId = 1;
  var nextBrandId = 1;
  var nextCampaignId = 1;

  let influencers = Map.empty<Nat, InfluencerApplication>();
  let brands = Map.empty<Nat, BrandInquiry>();
  let campaigns = Map.empty<Nat, Campaign>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinAuthorization(accessControlState);

  // User Approval Methods
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Influencer Functions

  // Open to anyone: guests and users can submit influencer applications
  public shared ({ caller }) func submitInfluencerApplication(app : InfluencerApplication) : async () {
    let newApp : InfluencerApplication = {
      app with
      id = nextInfluencerId;
      approved = false;
      createdAt = Time.now();
    };
    influencers.add(nextInfluencerId, newApp);
    nextInfluencerId += 1;
  };

  // Admin-only: viewing all influencer applications is an admin dashboard feature
  public query ({ caller }) func getAllInfluencers() : async [InfluencerApplication] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all influencer applications");
    };
    influencers.values().toArray().sort();
  };

  // Admin-only: checking approval status is an admin dashboard feature
  public query ({ caller }) func isInfluencerApproved(influencerId : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can check influencer approval status");
    };
    switch (influencers.get(influencerId)) {
      case (null) {
        Runtime.trap("Influencer not found");
      };
      case (?app) { app.approved };
    };
  };

  // Admin-only: approving/rejecting influencers
  public shared ({ caller }) func approveInfluencer(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (influencers.get(id)) {
      case (null) { Runtime.trap("Influencer application not found") };
      case (?app) {
        let updatedApp : InfluencerApplication = {
          app with approved;
        };
        influencers.add(id, updatedApp);
      };
    };
  };

  // Brand Functions

  // Admin-only: viewing all brand inquiries is an admin dashboard feature
  public query ({ caller }) func getAllBrands() : async [BrandInquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all brand inquiries");
    };
    brands.values().toArray().sort();
  };

  // Open to anyone: guests and users can submit brand inquiries
  public shared ({ caller }) func submitBrandInquiry(inquiry : BrandInquiry) : async () {
    let newInquiry : BrandInquiry = {
      inquiry with
      id = nextBrandId;
      createdAt = Time.now();
    };
    brands.add(nextBrandId, newInquiry);
    nextBrandId += 1;
  };

  // Campaign Functions

  // Admin-only: viewing all campaigns is an admin dashboard feature
  public query ({ caller }) func getAllCampaigns() : async [Campaign] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all campaigns");
    };
    campaigns.values().toArray().sort();
  };

  // Admin-only: creating campaigns is an admin dashboard feature
  public shared ({ caller }) func createCampaign(campaign : Campaign) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create campaigns");
    };
    let newCampaign : Campaign = {
      campaign with
      id = nextCampaignId;
      commission = campaign.dealValue * 20 / 100; // 20% commission
      createdAt = Time.now();
    };
    campaigns.add(nextCampaignId, newCampaign);
    nextCampaignId += 1;
  };

  // Admin-only: updating campaign status
  public shared ({ caller }) func updateCampaignStatus(campaignId : Nat, status : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (campaigns.get(campaignId)) {
      case (null) { Runtime.trap("Campaign not found") };
      case (?campaign) {
        let updatedCampaign : Campaign = {
          campaign with status;
        };
        campaigns.add(campaignId, updatedCampaign);
      };
    };
  };

  // Admin-only: update campaign deal value (also recalculates commission)
  public shared ({ caller }) func updateCampaignDealValue(campaignId : Nat, dealValue : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (campaigns.get(campaignId)) {
      case (null) { Runtime.trap("Campaign not found") };
      case (?campaign) {
        let updatedCampaign : Campaign = {
          campaign with
          dealValue;
          commission = dealValue * 20 / 100;
        };
        campaigns.add(campaignId, updatedCampaign);
      };
    };
  };

  // Admin-only: get aggregate stats
  public query ({ caller }) func getAggregateStats() : async { totalDealValue : Nat; totalCommission : Nat } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view aggregate stats");
    };
    var totalDealValue = 0;
    var totalCommission = 0;
    for (campaign in campaigns.values()) {
      totalDealValue += campaign.dealValue;
      totalCommission += campaign.commission;
    };
    { totalDealValue; totalCommission };
  };
};
