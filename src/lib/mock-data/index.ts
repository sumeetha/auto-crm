export { type User, users } from "./users";
export { type Vehicle, inventory } from "./inventory";
export { type Lead, leads } from "./leads";
export { type Deal, deals } from "./deals";
export { type Customer, customers } from "./customers";
export {
  type CustomerTimelineEvent,
  type CustomerTimelineEventKind,
  getCustomerEngagementTimeline,
} from "./customer-timeline";
export { type Appointment, appointments } from "./appointments";
export {
  type Message,
  type ConversationSummary,
  type Conversation,
  conversations,
} from "./conversations";
export {
  type FiBundleSuggestion,
  type ObjectionPrompt,
  type DealCopilotData,
  getDealCopilotData,
} from "./deal-copilot";
export {
  type Campaign,
  type CampaignChannel,
  type CampaignSegment,
  type CampaignStatus,
  campaigns,
  campaignSegments,
} from "./campaigns";
export {
  type SocialMessage,
  type SocialMessageSender,
  type SocialPlatform,
  type SocialThread,
  type SocialThreadStatus,
  socialThreads,
} from "./social-inbox";
