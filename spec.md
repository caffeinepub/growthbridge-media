# Specification

## Summary
**Goal:** Build GrowthBridge Media, a full micro-influencer marketing platform with a public-facing landing page, two submission forms, a Motoko on-chain backend, and a protected admin dashboard.

**Planned changes:**

**Navigation**
- Sticky navbar with GrowthBridge Media logo, links (Home, For Brands, For Influencers, Pricing, Contact), active link highlighting, scroll-triggered background change, and mobile hamburger menu with toggle animation

**Landing Page Sections**
- Hero section with headline, subheadline, animated stat counter, and two CTA buttons ("Join as Influencer", "Work With Us as a Brand") that scroll to their respective forms
- "How It Works" section with two parallel tracks (For Brands: 3 steps; For Influencers: 3 steps)
- Services section with two columns listing brand services and influencer services
- Pricing section describing the 20% commission model and optional package tiers — no currency symbols or monetary figures anywhere

**Forms**
- Influencer Application Form (9 fields: Full Name, Instagram Handle, Followers Count, Niche, Engagement Rate, Email, Location, Rate Card, Portfolio Link) with inline validation, loading button state, success modal, and no page reload
- Brand Inquiry Form (8 fields: Brand Name, Industry, Website, Marketing Contact Name, Email, Budget Range, Campaign Goal, Timeline) with same validation and success modal behavior

**Motoko Backend**
- Single `backend/main.mo` actor storing Influencer, Brand, and Campaign records per defined schemas
- Influencer schema includes `approved` (Bool); Campaign schema auto-calculates 20% commission from dealValue
- Exposed update/query functions for create, read, approve/reject influencer, update campaign status and deal value

**Admin Dashboard**
- Protected route behind Internet Identity login
- View and approve/reject influencer applications
- View all brand inquiries
- Assign influencers to campaigns, set deal value and status
- Aggregate stats: total deal value and total 20% commission across all campaigns

**UI/UX**
- Minimal modern startup theme: white background, clear typography hierarchy, soft shadows, rounded buttons, high whitespace
- Smooth scroll behavior, hover/focus/active states on all interactive elements
- Semantic HTML5, aria attributes, keyboard navigability throughout

**User-visible outcome:** Visitors can learn about GrowthBridge Media, apply as influencers, or submit brand inquiries via validated forms. An admin can log in with Internet Identity to manage applications, create campaigns, assign influencers, and track total deal value and commission earnings.
