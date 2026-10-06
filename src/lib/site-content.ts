/**
 * Editable prose/copy for the home page and other content pages.
 *
 * This site has no database or admin panel, so page content is managed
 * directly in code: to edit any of this copy, edit this file and
 * redeploy. Structural/navigational labels (button text tied to a nav
 * link, form field labels, etc.) stay inline in their components — only
 * the actual marketing/informational copy lives here.
 *
 * Everything below reflects real organizational content provided by
 * Kemet Foundation Inc. For known-placeholder content (the Privacy
 * Policy and Terms of Service, pending legal review), see
 * src/app/privacy/page.tsx and src/app/terms/page.tsx, which carry an
 * explicit on-page notice instead of living here.
 */

export const HERO_CONTENT = {
  eyebrow: "A Florida Nonprofit Organization",
  headingLines: ["Building Community.", "Preserving Legacy.", "Creating the Future."],
  body: "Kemet Foundation Inc unites African heritage, education, and economic empowerment to strengthen families and build lasting institutions for our community.",
};

export const MISSION_TEASER_CONTENT = {
  eyebrow: "Our Mission",
  title: "Rooted in Heritage. Driven by Purpose.",
  description:
    "Kemet Foundation Inc exists to connect our community to African heritage and cultural education while building the economic, educational, and family foundations that make lasting advancement possible.",
};

export const PILLARS_CONTENT = {
  eyebrow: "What We Do",
  title: "Three Pillars of Our Work",
  description:
    "Everything we do is grounded in African heritage and cultural education, community development, and economic empowerment.",
  pillars: [
    {
      title: "Community",
      description:
        "We bring people together around shared heritage and shared purpose, strengthening the bonds of family and community that sustain us across generations.",
    },
    {
      title: "Economic Empowerment",
      description:
        "We encourage entrepreneurship and economic self-sufficiency, equipping individuals and families with the tools to build stability and pursue opportunity.",
    },
    {
      title: "Education",
      description:
        "We champion African heritage and cultural education alongside youth development, helping our community learn, grow, and lead with knowledge of who they are.",
    },
  ],
} as const;

export const GET_INVOLVED_CONTENT = {
  eyebrow: "Get Involved",
  title: "Ways to Support the Mission",
  options: [
    {
      title: "Volunteer",
      description: "Give your time and talents to support our community's work.",
      href: "/contact",
      cta: "Get in Touch",
    },
    {
      title: "Become a Member",
      description: "Join our community and help guide the direction of our work.",
      href: "/membership",
      cta: "Join Us",
    },
    {
      title: "Donate",
      description: "Support our mission with a one-time or recurring gift.",
      href: "/donate",
      cta: "Give Now",
    },
  ],
} as const;

export const MEMBERSHIP_TEASER_CONTENT = {
  eyebrow: "Membership",
  title: "Join a Community Committed to Collective Advancement",
  body: "Membership connects you with others working toward the same goals: strengthening families, supporting economic empowerment, and passing on African heritage to the next generation. Members help shape our work and stand alongside a community invested in building something lasting.",
};

export const DONATE_BANNER_CONTENT = {
  title: "Your Support Builds Lasting Institutions",
  body: "Every gift helps us invest in African heritage and cultural education, community development, and economic empowerment for the families we serve.",
};

export const NEWSLETTER_SECTION_CONTENT = {
  eyebrow: "Stay Connected",
  title: "Join Our Newsletter",
  description:
    "Get updates on upcoming events, announcements, and ways to get involved with Kemet Foundation Inc.",
};

export const MISSION_PAGE_CONTENT = {
  heroEyebrow: "Our Mission",
  heroTitle: "Heritage, Family, and Empowerment",
  mission_statement:
    "Kemet Foundation Inc exists to uplift our community by reconnecting people with African heritage and cultural education, strengthening families, and building pathways to economic empowerment. We are committed to community development and collective advancement, working alongside the people we serve to build institutions that last.",
  vision_statement:
    "We envision a community where African heritage is celebrated and passed down with pride, where families are strong and supported, and where economic opportunity and quality education are within reach for everyone. We see a future built on collective advancement, entrepreneurship, and the sustainable institutions our community deserves.",
  core_principles:
    "African Heritage & Cultural Education — honoring and teaching the history and culture that shape our identity\nCommunity Development — investing in the people and places that make our community strong\nFamily & Community Strengthening — supporting the bonds that hold families and neighborhoods together\nEconomic Empowerment & Entrepreneurship — equipping people with tools to build stability and opportunity\nEducation & Youth Development — preparing the next generation to lead\nCommunity Service — showing up for one another in tangible, consistent ways",
  why_kemet:
    "Kemet Foundation Inc takes its name from the ancient name for the land now known as Egypt, a reminder of the depth and richness of African heritage. We believe that understanding where we come from strengthens our ability to build where we are going. Our work is grounded in the belief that cultural pride, education, and economic self-sufficiency are inseparable parts of community advancement.",
  our_approach:
    "We approach our work by listening to and partnering with the community we serve, focusing on education, family strengthening, and economic empowerment as the foundation for lasting change. Rather than working in isolation, we build toward sustainable institutions designed to serve our community for generations, guided by our members and grounded in collective action.",
  community_impact:
    "Our impact is measured in the families strengthened, the heritage preserved and passed on, and the opportunities created through education and economic empowerment. As a growing organization, we are committed to building sustainable institutions whose impact will be felt for generations, and we invite our community to grow with us.",
} as const;

export const MEMBERSHIP_PAGE_CONTENT = {
  heroTitle: "Join Kemet Foundation Inc",
  heroDescription:
    "Membership is our way of welcoming individuals who want to stand alongside the foundation as we work toward African heritage and cultural education, community development, family strengthening, and economic empowerment.",
  highlights: [
    {
      title: "Community",
      body: "Membership connects you with others who share a commitment to African heritage, cultural education, and community advancement.",
    },
    {
      title: "Stay Informed",
      body: "Members receive updates on foundation news, announcements, and upcoming events so you can stay connected to our work.",
    },
    {
      title: "Get Involved",
      body: "As a member, you can let us know how you'd like to volunteer or contribute to the foundation's mission.",
    },
  ],
  formIntroTitle: "Become a Member",
  formIntroBody:
    "Fill out the form below to let us know you’re interested. A member of our team will follow up with you directly.",
} as const;

export const CONTACT_PAGE_CONTENT = {
  title: "We'd Love to Hear From You",
  description:
    "Whether you have a question about membership, events, donations, volunteering, or partnerships, send us a message and we'll get back to you.",
};

export const DONATE_PAGE_CONTENT = {
  title: "Support Our Mission",
  description:
    "Your gift helps us invest in African heritage and cultural education, community development, family strengthening, and economic empowerment.",
  acknowledgmentNotice:
    "will provide a donation acknowledgment for your records. Please contact us regarding the tax-deductibility of your gift.",
};

export const TEAM_PAGE_CONTENT = {
  title: "The People Behind Kemet Foundation",
};
