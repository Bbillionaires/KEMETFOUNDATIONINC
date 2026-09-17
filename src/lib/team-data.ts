/**
 * Team roster. This site has no database or admin panel, so the team list
 * is managed directly in code: to add, edit, or remove a member, edit this
 * file and redeploy the site.
 *
 * Only name and title are shown publicly — no residential addresses,
 * registered-agent addresses, phone numbers, or personal emails from
 * public filings.
 */
export type TeamMemberRecord = {
  name: string;
  title: string;
};

export const TEAM_MEMBERS: TeamMemberRecord[] = [
  { name: "Raphael N. Lewis", title: "President / Director" },
  { name: "Leroyal Chieves", title: "Treasurer / Director" },
  { name: "Sasha-Gaye Wallace Kelman", title: "Secretary / Director" },
  { name: "DeAris Henry", title: "Vice President" },
];
