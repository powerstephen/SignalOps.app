'use client'
import { useState } from 'react'
import { TrendingUp, AlertTriangle, CheckCircle, Zap, BookOpen, Copy, Send } from 'lucide-react'

const MOCK_DEALS = [
  { id:'d101', company:'Kairon Growth', contact:'Sophie Laurent', title:'RevOps Lead', stage:'Qualified', deal_value:12800, health_score:28, status:'Stalling', engagement_score:25, commitment_score:22, velocity_score:32, stakeholder_score:38, top_signal:'Rep has sent 11 emails, prospect replied to 2 — ratio has completely inverted', risk_flags:['Email ratio inverted — prospect ghosting','No next meeting in 16 days','No reciprocal commitments made'], next_action:'Stop emailing. Call the champion directly and ask: "Is this still a priority for you?" Get a yes or a no today.', days_in_stage:21, avg_days_won:7,
    email1:{ subject:'Is this still a priority?', body:'Hi Sophie,\n\nI\'ll be direct — I\'ve sent a few emails and haven\'t heard back. I don\'t want to keep nudging if the timing is off.\n\nIs this still something Kairon Growth is looking to solve this quarter? A simple yes or no works.\n\nEither way, I appreciate the time you gave us.', timing:'Send now', goal:'Get a clear yes or no' },
    email2:{ subject:'Leaving this with you', body:'Hi Sophie,\n\nI haven\'t heard back so I\'ll assume the timing isn\'t right. No hard feelings at all.\n\nIf priorities shift and revenue intelligence becomes relevant again, I\'m one reply away. I\'ll check back in Q3.\n\nWishing you well in the meantime.', timing:'Schedule · Day 5', goal:'Clean break-up, door open' } },

  { id:'d102', company:'Flowcast', contact:'Ben Murphy', title:'Head of Sales', stage:'Proposal', deal_value:22100, health_score:32, status:'Stalling', engagement_score:30, commitment_score:28, velocity_score:35, stakeholder_score:44, top_signal:'Champion has not replied in 13 days — deal is orphaned', risk_flags:['Champion silent 13 days','No exec sponsor identified','Contract not opened'], next_action:'Find a second contact at Flowcast immediately — 13 days silence with a proposal out means the champion has lost internal support.', days_in_stage:16, avg_days_won:9,
    email1:{ subject:'The proposal — still relevant?', body:'Hi Ben,\n\nIt\'s been a couple of weeks since I sent the proposal and I haven\'t heard back. That\'s usually a signal that something has changed internally.\n\nIs the project still moving forward? If there\'s a blocker I can help with — budget, internal alignment, timing — I\'d rather know now than keep the deal in limbo.\n\nWhat\'s the honest picture?', timing:'Send now', goal:'Surface the blocker' },
    email2:{ subject:'One last check-in', body:'Hi Ben,\n\nI\'ll keep this short — if the proposal is no longer being considered, just let me know and I\'ll close this off on my end.\n\nIf it is still live and something got in the way, I\'m happy to pick up where we left off. No pressure either way.', timing:'Schedule · Day 6', goal:'Final check-in' } },

  { id:'d103', company:'Bridgeline Tech', contact:'Conor Walsh', title:'VP Sales', stage:'Negotiation', deal_value:18500, health_score:31, status:'Stalling', engagement_score:28, commitment_score:30, velocity_score:29, stakeholder_score:42, top_signal:'Negotiation dragging — 24 days vs 8-day average for won deals at this stage', risk_flags:['Stage velocity 3x over average','Last contact was rep-initiated','No timeline agreed'], next_action:'Send a "go/no-go" email today. Ask for a decision date. Open-ended negotiations at 3x average duration almost never close.', days_in_stage:24, avg_days_won:8,
    email1:{ subject:'Go or no-go — I need to know', body:'Hi Conor,\n\nWe\'ve been in negotiation for a few weeks now and I want to be straight with you — deals that stay open this long without a decision date rarely close, and that\'s bad for both of us.\n\nCan we agree a decision date by end of this week? Even "not until next quarter" is a useful answer. I\'d rather plan around the truth than keep this open indefinitely.', timing:'Send now', goal:'Force a decision date' },
    email2:{ subject:'Closing this off unless I hear otherwise', body:'Hi Conor,\n\nI\'m going to assume the timing has shifted unless I hear from you. I\'ll mark this as paused on my end and follow up in Q3.\n\nIf that\'s wrong and there\'s still appetite to move forward this quarter, just reply and I\'ll pick it straight back up.', timing:'Schedule · Day 5', goal:'Create urgency to respond' } },

  { id:'d104', company:'NorthStar HQ', contact:'Priya Mehta', title:'CRO', stage:'Qualified', deal_value:31000, health_score:26, status:'Stalling', engagement_score:22, commitment_score:18, velocity_score:30, stakeholder_score:35, top_signal:'No next step ever booked — every meeting ends without a follow-up scheduled', risk_flags:['No next step pattern across 4 meetings','CRO disengaging','No data connected'], next_action:'Do not book another call without getting a defined outcome from this one. Ask the CRO directly what would make them confident to move forward.', days_in_stage:19, avg_days_won:7,
    email1:{ subject:'What would make you confident to move forward?', body:'Hi Priya,\n\nWe\'ve had a few good conversations but I\'ll be honest — we keep ending calls without a clear next step, and that\'s on me as much as anyone.\n\nI want to ask you directly: what would need to be true for NorthStar to move forward with this? If there\'s a specific concern I haven\'t addressed, I\'d rather hear it now.\n\nOne honest answer is worth more than another demo call.', timing:'Send now', goal:'Surface the real blocker' },
    email2:{ subject:'Should I close this off?', body:'Hi Priya,\n\nI haven\'t heard back and I don\'t want to keep sending emails that aren\'t adding value.\n\nShould I close this off and revisit in Q3? Or is there something specific holding things up I can help with now?', timing:'Schedule · Day 5', goal:'Force a response' } },

  { id:'d105', company:'Clearpath SaaS', contact:'James O\'Brien', title:'Head of RevOps', stage:'Proposal', deal_value:14200, health_score:33, status:'Stalling', engagement_score:32, commitment_score:25, velocity_score:38, stakeholder_score:40, top_signal:'Proposal opened once, 9 days ago, not reopened', risk_flags:['Proposal not re-opened in 9 days','No questions asked about proposal','Single contact'], next_action:'Call to walk through the proposal live — static proposals stall. A live walkthrough gets questions answered and re-establishes momentum.', days_in_stage:14, avg_days_won:9,
    email1:{ subject:'Walk through the proposal together?', body:'Hi James,\n\nI know you\'ve had the proposal for a few days. In my experience, static documents raise more questions than they answer — and those questions kill momentum.\n\nCould we do a 20-minute live walkthrough this week? I can cover exactly what\'s relevant to Clearpath and answer anything on the spot. Much faster than email back and forth.', timing:'Send now', goal:'Get a live walkthrough booked' },
    email2:{ subject:'Proposal still relevant?', body:'Hi James,\n\nJust checking in — is the proposal still being considered? If something\'s changed or there are questions I haven\'t answered, I\'d rather know.\n\nHappy to jump on a quick call or answer anything over email. Whatever\'s easier.', timing:'Schedule · Day 5', goal:'Re-engage on proposal' } },

  { id:'d106', company:'Vantage Labs', contact:'Alex Kim', title:'VP Revenue', stage:'Qualified', deal_value:9800, health_score:29, status:'Stalling', engagement_score:24, commitment_score:20, velocity_score:33, stakeholder_score:42, top_signal:'Champion went on leave — no handover contact provided', risk_flags:['Champion unavailable','No backup contact','Deal paused informally'], next_action:'Contact the company via LinkedIn to identify who is covering. Do not wait for the champion to return — deals that pause at this stage rarely restart.', days_in_stage:17, avg_days_won:7,
    email1:{ subject:'Picking up while you\'re away', body:'Hi Alex,\n\nI understand you\'re currently away — I hope it\'s a good break.\n\nI wanted to make sure this doesn\'t stall while you\'re out. Is there someone covering your role who I should connect with, or would you prefer to pick this up directly when you\'re back?\n\nJust let me know the best way to keep things moving.', timing:'Send now', goal:'Find a covering contact' },
    email2:{ subject:'Ready to pick up when you are', body:'Hi Alex,\n\nNo rush at all — just wanted you to know I\'m ready to pick this up whenever you\'re back and settled.\n\nDrop me a note when the time is right and we\'ll get momentum back quickly.', timing:'Schedule · Day 7', goal:'Warm re-entry when they return' } },

  { id:'d201', company:'Stackline', contact:'Olivia Chen', title:'VP Revenue', stage:'Proposal', deal_value:28400, health_score:52, status:'At Risk', engagement_score:50, commitment_score:48, velocity_score:55, stakeholder_score:60, top_signal:'Proposal sent 9 days ago with no substantive response', risk_flags:['9 days since last prospect reply','No next meeting scheduled','Single contact engaged'], next_action:'Call today — do not send another email. 9 days silence at proposal stage is a serious stall signal that email will not fix.', days_in_stage:12, avg_days_won:9,
    email1:{ subject:'The proposal — a quick question', body:'Hi Olivia,\n\nI sent the proposal over a week ago and haven\'t heard back. I\'m not going to pretend that\'s not a signal.\n\nOne question: is there something in the proposal that didn\'t land right? I\'d rather know and fix it than let this drift.\n\nEven a quick "not the right time" would help me understand where things stand.', timing:'Send now', goal:'Surface the real objection' },
    email2:{ subject:'Last nudge on the proposal', body:'Hi Olivia,\n\nI\'ll leave this with you. If the proposal is still being reviewed and timing is just tight, I completely understand — reply whenever suits.\n\nIf it\'s no longer being considered, a quick note would be appreciated so I can close it off on my end.', timing:'Schedule · Day 5', goal:'Final nudge' } },

  { id:'d202', company:'Metric Labs', contact:'Tom Eriksson', title:'Head of Sales', stage:'Negotiation', deal_value:15600, health_score:48, status:'At Risk', engagement_score:44, commitment_score:55, velocity_score:40, stakeholder_score:52, top_signal:'Deal in negotiation for 19 days vs 8-day average for won deals', risk_flags:['Stage velocity 2.4x over average','Champion engagement declining','No trial data connected'], next_action:'Get a clear written decision timeline from the champion this week. Verbal commitments at this stage are not enough.', days_in_stage:19, avg_days_won:8,
    email1:{ subject:'Can we agree a decision date?', body:'Hi Tom,\n\nWe\'ve been in negotiation for a few weeks now and I want to make sure this doesn\'t drift further.\n\nVerbal interest is great but I\'ve found that without a written decision date, these conversations tend to lose momentum. Can we agree — even informally — on a date by which Metric Labs will make a call?\n\nIt helps me prioritise on my end too. What does your timeline look like?', timing:'Send now', goal:'Get a written commitment on timeline' },
    email2:{ subject:'Checking in on the timeline', body:'Hi Tom,\n\nJust following up on the timeline question. I know things get busy — if the decision has shifted to next quarter, just let me know and I\'ll plan accordingly.\n\nOtherwise, happy to jump on a quick call to get things moving this week.', timing:'Schedule · Day 4', goal:'Timeline follow-up' } },

  { id:'d203', company:'Redshift Analytics', contact:'Diana Park', title:'Director of Sales Ops', stage:'Proposal', deal_value:19800, health_score:54, status:'At Risk', engagement_score:52, commitment_score:45, velocity_score:58, stakeholder_score:62, top_signal:'Decision maker not engaged — champion is below budget authority', risk_flags:['No exec sponsor','Champion cannot approve budget','Competitor mentioned in last call'], next_action:'Ask the champion to arrange an intro to the budget holder this week. Without exec visibility, this deal will stall at legal or procurement.', days_in_stage:8, avg_days_won:9,
    email1:{ subject:'Getting the right people in the room', body:'Hi Diana,\n\nI want to make sure this doesn\'t stall at approval stage. In my experience, proposals that haven\'t had exec visibility tend to get delayed or deprioritised when it comes to sign-off — even when the champion is fully bought in.\n\nWould you be able to arrange a brief intro to whoever holds budget on your side? Even a 15-minute call would make a big difference in keeping this moving.', timing:'Send now', goal:'Get exec intro' },
    email2:{ subject:'The budget holder question', body:'Hi Diana,\n\nFollowing up on getting the right stakeholders involved. I know it\'s not always straightforward to arrange internally.\n\nIf it helps, I can send over a short executive summary tailored for whoever holds budget — something concise that makes the internal case easy to make. Would that be useful?', timing:'Schedule · Day 4', goal:'Offer exec summary as a tool' } },

  { id:'d204', company:'Lumino SaaS', contact:'Ryan Clarke', title:'Head of Growth', stage:'Qualified', deal_value:11400, health_score:56, status:'At Risk', engagement_score:58, commitment_score:42, velocity_score:60, stakeholder_score:55, top_signal:'Strong verbal interest but zero reciprocal commitments — no trial, no data connected', risk_flags:['No reciprocal commitments in 3 meetings','Verbal interest not converting to action','Single stakeholder'], next_action:'Ask for a specific commitment in the next meeting — even something small like connecting one data source. Action separates real deals from endless conversations.', days_in_stage:11, avg_days_won:7,
    email1:{ subject:'Can I ask for one small thing?', body:'Hi Ryan,\n\nWe\'ve had some great conversations and I can tell there\'s genuine interest. But I\'ve noticed we keep ending calls without a concrete next step — and that\'s usually a sign something is getting in the way.\n\nI\'d love to ask for one small commitment before our next call: connecting a single data source so you can see SignalOps working with your actual numbers. Takes about 10 minutes and it changes the conversation completely.\n\nWould you be willing to do that before we speak again?', timing:'Send now', goal:'Get a micro-commitment' },
    email2:{ subject:'Still worth exploring?', body:'Hi Ryan,\n\nI haven\'t heard back and I want to make sure I\'m not wasting your time or mine.\n\nIs this still something Lumino is actively looking to solve? If yes, I\'d love to find a way to get some momentum. If timing has shifted, just say the word.', timing:'Schedule · Day 5', goal:'Qualify intent' } },

  { id:'d205', company:'Aperture Growth', contact:'Niamh Doyle', title:'VP Sales', stage:'Negotiation', deal_value:24600, health_score:51, status:'At Risk', engagement_score:48, commitment_score:60, velocity_score:44, stakeholder_score:54, top_signal:'Legal review requested 12 days ago — no update since', risk_flags:['Legal review stalled','No timeline for legal sign-off','Champion not escalating internally'], next_action:'Ask champion to set a specific legal review deadline and escalate internally if needed. Deals that enter legal without a timeline regularly die there.', days_in_stage:15, avg_days_won:8,
    email1:{ subject:'The legal review — any update?', body:'Hi Niamh,\n\nIt\'s been nearly two weeks since the legal review was requested and I haven\'t had an update. I know legal moves at its own pace, but without a timeline it\'s hard to plan on either side.\n\nCould you find out where it sits and give me a rough sense of when we might have a decision? Even a ballpark would help. If there\'s something I can do to make it easier — a redline, a security questionnaire, anything — just say the word.', timing:'Send now', goal:'Get a legal timeline' },
    email2:{ subject:'Legal still in progress?', body:'Hi Niamh,\n\nJust checking in — is the legal review still in progress or has something changed?\n\nI want to make sure this doesn\'t fall off the radar on either side. Happy to do whatever helps move it forward.', timing:'Schedule · Day 5', goal:'Legal status check' } },

  { id:'d206', company:'Tidewave HQ', contact:'Michael Torres', title:'CRO', stage:'Proposal', deal_value:33200, health_score:55, status:'At Risk', engagement_score:55, commitment_score:50, velocity_score:52, stakeholder_score:65, top_signal:'Multi-threaded but engagement dropping across all contacts simultaneously', risk_flags:['Engagement declining across all contacts','No meeting booked','Budget review mentioned'], next_action:'Request a group check-in call with all three contacts this week. Simultaneous disengagement across contacts usually signals an internal budget decision is underway.', days_in_stage:10, avg_days_won:9,
    email1:{ subject:'A quick group check-in?', body:'Hi Michael,\n\nI\'ve noticed engagement has gone quiet across the team over the last week or so. In my experience, when that happens simultaneously it usually means something has shifted internally — a budget review, a reprioritisation, or a decision being made.\n\nI\'d rather know now than keep following up in the dark. Could we get a quick 20-minute call with you and the team this week to get an honest read on where things stand?', timing:'Send now', goal:'Surface the internal decision' },
    email2:{ subject:'Has something changed internally?', body:'Hi Michael,\n\nI haven\'t heard back and I don\'t want to keep nudging if the situation has changed.\n\nIf a budget decision is underway or the project has been deprioritised, I completely understand — just let me know and I\'ll check back next quarter. No hard feelings either way.', timing:'Schedule · Day 4', goal:'Get an honest status update' } },

  { id:'d207', company:'Foundry AI', contact:'Lisa Brennan', title:'Head of RevOps', stage:'Qualified', deal_value:16800, health_score:53, status:'At Risk', engagement_score:56, commitment_score:44, velocity_score:57, stakeholder_score:58, top_signal:'Champion requested a "pause" pending internal restructure announcement', risk_flags:['Deal formally paused','Internal restructure underway','Champion role may change'], next_action:'Send a brief note acknowledging the pause and ask for a specific date to reconnect. Keep the relationship warm without being pushy.', days_in_stage:13, avg_days_won:7,
    email1:{ subject:'Happy to wait — when should I check back?', body:'Hi Lisa,\n\nCompletely understand the pause given what\'s happening internally. Restructures take priority and I don\'t want to add noise at a busy time.\n\nWhen would be a good point to reconnect? Even a rough timeframe — "end of next month", "after the announcement" — helps me plan and means I\'m not bothering you at the wrong moment.', timing:'Send now', goal:'Get a specific reconnect date' },
    email2:{ subject:'Checking in — any update on timing?', body:'Hi Lisa,\n\nJust a gentle check-in to see if the dust has settled and whether this is a good moment to reconnect.\n\nNo pressure at all — if things are still in flux just say the word and I\'ll give it more time.', timing:'Schedule · Day 10', goal:'Warm re-entry post-restructure' } },

  { id:'d301', company:'Pipefy', contact:'Marcus Webb', title:'CRO', stage:'Proposal', deal_value:34200, health_score:76, status:'On Track', engagement_score:80, commitment_score:72, velocity_score:75, stakeholder_score:85, top_signal:'3 contacts from prospect side engaged — multi-threaded deals close at 2x rate', risk_flags:['No next meeting booked'], next_action:'Book a follow-up call before end of week — no next meeting is a yellow flag at proposal stage even with good engagement.', days_in_stage:6, avg_days_won:9,
    email1:{ subject:'Next step on the proposal?', body:'Hi Marcus,\n\nReally glad to have three of your team engaged — that kind of multi-stakeholder involvement makes a big difference in getting to a smooth decision.\n\nI want to make sure we keep momentum going. Can we book a follow-up call this week to walk through any questions and agree next steps? I\'m flexible on timing — what works for the team?', timing:'Send now', goal:'Book the next meeting' },
    email2:{ subject:'Finding a time this week', body:'Hi Marcus,\n\nJust following up on booking a time. Even a 20-minute slot works — I want to make sure the proposal stays top of mind while the team is engaged.\n\nWhat does your calendar look like Thursday or Friday?', timing:'Schedule · Day 3', goal:'Pin down a meeting time' } },

  { id:'d302', company:'Growthline', contact:'James Thornton', title:'VP Revenue', stage:'Qualified', deal_value:18900, health_score:72, status:'On Track', engagement_score:74, commitment_score:65, velocity_score:75, stakeholder_score:70, top_signal:'Champion actively driving internal process — sharing materials with exec team', risk_flags:[], next_action:'Request an exec sponsor introduction this week — deals with exec visibility close 40% faster.', days_in_stage:4, avg_days_won:7,
    email1:{ subject:'Getting exec visibility — can you help?', body:'Hi James,\n\nReally appreciate you driving this internally and sharing the materials with your exec team — that kind of internal championing makes a real difference.\n\nOne thing that consistently accelerates these decisions is brief exec visibility. Would you be able to introduce me to whoever holds budget or has final sign-off? Even a 15-minute call would help me tailor the business case to what matters most to them.', timing:'Send now', goal:'Get exec intro' },
    email2:{ subject:'The exec intro — still possible?', body:'Hi James,\n\nFollowing up on the exec intro. I know it can be awkward to arrange internally — if it helps, I can send a short briefing note you could forward directly, so they have context before we speak.\n\nLet me know what would make it easiest.', timing:'Schedule · Day 4', goal:'Offer to make the intro easier' } },

  { id:'d303', company:'Quantum Scale', contact:'Fiona McCarthy', title:'VP Sales', stage:'Negotiation', deal_value:29700, health_score:74, status:'On Track', engagement_score:76, commitment_score:78, velocity_score:70, stakeholder_score:72, top_signal:'Trial completed successfully — champion presenting internal business case this week', risk_flags:[], next_action:'Offer to join the internal presentation as a subject matter expert. Vendors who participate in internal reviews close at significantly higher rates.', days_in_stage:7, avg_days_won:8,
    email1:{ subject:'Can I join the internal presentation?', body:'Hi Fiona,\n\nHearing that the trial went well and you\'re presenting the business case this week — that\'s a great position to be in.\n\nI\'d love to offer to join the session as a subject matter expert, even just for 10 minutes to answer technical or commercial questions from the team. Vendors who participate in internal reviews close at significantly higher rates — and it takes the pressure off you to represent everything alone.\n\nWould that be welcome?', timing:'Send now', goal:'Join the internal presentation' },
    email2:{ subject:'How did the presentation go?', body:'Hi Fiona,\n\nHoping the internal presentation went well this week. I\'d love to hear how it landed and what the next step looks like from here.\n\nIf there were questions I can help answer, just send them over and I\'ll get back to you quickly.', timing:'Schedule · Day 3', goal:'Follow up post-presentation' } },

  { id:'d304', company:'Nexus Revenue', contact:'David Chang', title:'RevOps Director', stage:'Proposal', deal_value:22400, health_score:71, status:'On Track', engagement_score:72, commitment_score:68, velocity_score:74, stakeholder_score:70, top_signal:'Proposal reviewed within 2 hours of sending — strong interest signal', risk_flags:['One week without follow-up from prospect'], next_action:'Send a light follow-up today — proposal reviewed same day is a strong signal. Check if they have questions before momentum cools.', days_in_stage:5, avg_days_won:9,
    email1:{ subject:'Saw you reviewed the proposal — any questions?', body:'Hi David,\n\nGlad the proposal landed quickly — reviewing it the same day is always a good sign.\n\nDid anything stand out that you\'d like to dig into? I\'d rather answer questions now while it\'s fresh than have them slow things down later.\n\nHappy to jump on a quick call or just answer anything over email — whatever\'s easier for you.', timing:'Send now', goal:'Keep momentum while interest is high' },
    email2:{ subject:'Following up on the proposal', body:'Hi David,\n\nJust checking in — has the proposal had a chance to circulate internally? Happy to send over any additional information that would help the decision.\n\nWhat are the next steps on your end?', timing:'Schedule · Day 4', goal:'Surface internal status' } },

  { id:'d305', company:'Orbit SaaS', contact:'Emma Sullivan', title:'Head of Sales', stage:'Qualified', deal_value:13600, health_score:73, status:'On Track', engagement_score:75, commitment_score:62, velocity_score:78, stakeholder_score:78, top_signal:'Connected CRM data in first meeting — high commitment signal', risk_flags:[], next_action:'Move to proposal this week — data connection in the first meeting is your strongest commitment signal. Strike while intent is high.', days_in_stage:3, avg_days_won:7,
    email1:{ subject:'Sending the proposal over', body:'Hi Emma,\n\nConnecting your CRM in the first meeting told me everything I needed to know about how seriously Orbit is approaching this — that kind of commitment is rare and I appreciate it.\n\nI\'m going to send the proposal over today while intent is high. I\'ve tailored it to what you shared in our call so it should feel relevant rather than generic.\n\nLet me know if you\'d like to walk through it together.', timing:'Send now', goal:'Move to proposal while intent is peak' },
    email2:{ subject:'Proposal — any questions?', body:'Hi Emma,\n\nHoping the proposal made sense. Happy to walk through any section that needs more context — sometimes it\'s faster to talk for 10 minutes than go back and forth over email.\n\nWhat are your initial thoughts?', timing:'Schedule · Day 3', goal:'Proposal follow-up' } },

  { id:'d401', company:'Revcast', contact:'Sarah Chen', title:'VP Sales', stage:'Negotiation', deal_value:21600, health_score:91, status:'Accelerating', engagement_score:94, commitment_score:90, velocity_score:88, stakeholder_score:85, top_signal:'Prospect replying faster than rep is sending — peak buying intent signal', risk_flags:[], next_action:'Send contract today — engagement is at absolute peak. Every day you wait, close probability drops. Do not overthink this.', days_in_stage:9, avg_days_won:12,
    email1:{ subject:'Sending the contract over now', body:'Hi Sarah,\n\nThe energy on this has been exceptional — you\'ve been faster to respond than most deals I see at this stage, and that tells me everything about how seriously Revcast is taking this.\n\nI\'m sending the contract over today. I don\'t want to let momentum drift when buying intent is this clear. Let me know if anything needs adjusting and I\'ll turn it around fast.', timing:'Send now', goal:'Strike while intent is peak' },
    email2:{ subject:'Contract — any questions before you sign?', body:'Hi Sarah,\n\nJust checking in on the contract. If there\'s anything you\'d like to talk through before signing — commercial terms, onboarding timeline, anything at all — I\'m available today.\n\nLet\'s get this over the line.', timing:'Schedule · Day 2', goal:'Remove final blockers to close' } },

  { id:'d402', company:'Salespath AI', contact:'Declan Murray', title:'VP Sales', stage:'Negotiation', deal_value:38400, health_score:88, status:'Accelerating', engagement_score:90, commitment_score:86, velocity_score:85, stakeholder_score:92, top_signal:'4 stakeholders from prospect side now engaged — exec sponsor introduced last week', risk_flags:[], next_action:'Accelerate contract process — multi-threaded at this level with exec visibility is your clearest close signal. Get legal involved now.', days_in_stage:8, avg_days_won:12,
    email1:{ subject:'Getting legal involved now', body:'Hi Declan,\n\nHaving four stakeholders engaged and an exec sponsor introduced is about as strong a close signal as I see. I don\'t want to let this sit in negotiation any longer than it needs to.\n\nI\'m looping in our legal team today to get the contract process started in parallel. Can you do the same on your side so we\'re not waiting on either end when the time comes?\n\nLet\'s get this closed properly.', timing:'Send now', goal:'Accelerate to contract' },
    email2:{ subject:'Legal — where are we?', body:'Hi Declan,\n\nChecking in on the legal process. Our side is ready to move — just want to make sure we\'re aligned on timeline so nothing slows down unnecessarily.\n\nWhat does the next week look like on your end?', timing:'Schedule · Day 3', goal:'Keep legal process moving' } },

  { id:'d403', company:'Stageflow', contact:'Niamh Carroll', title:'VP Sales', stage:'Proposal', deal_value:26800, health_score:85, status:'Accelerating', engagement_score:88, commitment_score:82, velocity_score:84, stakeholder_score:86, top_signal:'Champion pushed for faster timeline — asking to move to contract before Q2', risk_flags:[], next_action:'Match their urgency — send contract draft today and offer expedited legal review. When a champion pulls the timeline forward, act immediately.', days_in_stage:5, avg_days_won:9,
    email1:{ subject:'Matching your timeline — contract draft attached', body:'Hi Niamh,\n\nWhen a champion pushes for a faster timeline, I\'ve learned not to slow it down with process.\n\nI\'m sending over a contract draft today. I\'ve also flagged this internally for expedited legal review so we don\'t lose time on our end. If there\'s anything you need adjusted to make sign-off straightforward on your side, let me know and I\'ll turn it around fast.', timing:'Send now', goal:'Match urgency immediately' },
    email2:{ subject:'Contract — anything holding it up?', body:'Hi Niamh,\n\nJust checking in on the contract. Given you wanted to move before Q2 I want to make sure nothing is stuck on either side.\n\nIs there anything I can do to make the internal sign-off easier?', timing:'Schedule · Day 2', goal:'Remove sign-off blockers' } },

  { id:'d404', company:'Workstream', contact:'Patrick O\'Brien', title:'Head of RevOps', stage:'Negotiation', deal_value:31200, health_score:87, status:'Accelerating', engagement_score:89, commitment_score:88, velocity_score:83, stakeholder_score:88, top_signal:'Trial extended voluntarily — team actively using product daily', risk_flags:[], next_action:'Propose contract now while product value is being felt daily. Voluntary trial extension with daily usage is your strongest close signal.', days_in_stage:7, avg_days_won:12,
    email1:{ subject:'Your team is already using it daily — let\'s make it official', body:'Hi Patrick,\n\nThe fact that your team voluntarily extended the trial and is using the product daily is the clearest signal I get that this is working.\n\nI\'d like to propose we convert to a full contract now, while the value is being felt in real time. Waiting tends to create unnecessary back-and-forth. I can have a contract ready today — want me to send it over?', timing:'Send now', goal:'Convert trial to contract' },
    email2:{ subject:'Converting the trial — any blockers?', body:'Hi Patrick,\n\nJust following up on converting the trial. Is there anything on your end — procurement, legal, internal approval — that I can help move along?\n\nI want to make this as easy as possible to get over the line.', timing:'Schedule · Day 3', goal:'Clear any conversion blockers' } },

  { id:'d405', company:'PipeIQ', contact:'Elena Vasquez', title:'CRO', stage:'Proposal', deal_value:42100, health_score:89, status:'Accelerating', engagement_score:92, commitment_score:85, velocity_score:88, stakeholder_score:90, top_signal:'CRO personally reviewing proposal — unusual level of exec engagement for this stage', risk_flags:[], next_action:'Arrange a direct call with the CRO this week — exec engagement at proposal stage is rare. Use it to personalise the ROI case directly to their priorities.', days_in_stage:4, avg_days_won:9,
    email1:{ subject:'A direct conversation — this week?', body:'Hi Elena,\n\nHaving a CRO personally reviewing a proposal at this stage is something I don\'t take for granted — it tells me this is a real priority for PipeIQ.\n\nI\'d love to arrange a direct conversation with you this week, even 20 minutes. I want to make sure the ROI case speaks directly to what matters most to you at your level — not just what the team shared with me. Would that work?', timing:'Send now', goal:'Book direct CRO call' },
    email2:{ subject:'Finding time this week', body:'Hi Elena,\n\nFollowing up on finding a time to speak directly. I know CRO calendars are tight — I\'m flexible and can work around you.\n\nEven a 15-minute slot would be valuable. What does your week look like?', timing:'Schedule · Day 2', goal:'Pin down CRO meeting' } },

  { id:'d406', company:'Revelo', contact:'James Thornton', title:'VP Sales', stage:'Negotiation', deal_value:18900, health_score:84, status:'Accelerating', engagement_score:86, commitment_score:84, velocity_score:82, stakeholder_score:84, top_signal:'Legal review completed in 3 days — internal champion driving urgency', risk_flags:[], next_action:'Move to final pricing discussion immediately. Legal completing in 3 days with champion urgency means they are fully committed. Close this week.', days_in_stage:6, avg_days_won:12,
    email1:{ subject:'Legal done — let\'s talk final pricing', body:'Hi James,\n\nLegal completing in 3 days with you driving it internally — I\'ve rarely seen that level of internal urgency and I appreciate it.\n\nI want to match that energy. Can we get on a call today or tomorrow to finalise pricing and close this out this week? I\'m ready to move as fast as you are.', timing:'Send now', goal:'Close this week' },
    email2:{ subject:'Closing this out', body:'Hi James,\n\nJust following up — I want to make sure we close this before the week is out while momentum is at its highest.\n\nWhat\'s the best time for a quick call to finalise the details?', timing:'Schedule · Day 1', goal:'Final close push' } },

  { id:'d407', company:'Quota Labs', contact:'Anna Fischer', title:'VP Sales', stage:'Proposal', deal_value:22300, health_score:83, status:'Accelerating', engagement_score:85, commitment_score:80, velocity_score:84, stakeholder_score:82, top_signal:'Champion sent unsolicited ROI calculation to internal team — self-selling', risk_flags:[], next_action:'Send supporting ROI data to strengthen the internal case — when a champion self-sells, arm them with everything they need to win internally.', days_in_stage:5, avg_days_won:9,
    email1:{ subject:'Arming you for the internal case', body:'Hi Anna,\n\nHearing that you\'ve already shared an ROI calculation with your team internally — that\'s exactly the kind of internal championing that closes deals. I want to make sure you have everything you need to win that conversation.\n\nI\'m sending over our standard ROI data pack today — benchmarks, case studies, and a one-page business case template you can adapt. Use whatever is useful and discard the rest. Let me know if you\'d like me to tailor anything specific to Quota Labs\'s numbers.', timing:'Send now', goal:'Arm champion with internal selling tools' },
    email2:{ subject:'How is the internal case landing?', body:'Hi Anna,\n\nJust checking in — how has the ROI case landed internally? I\'m happy to put together anything else that would help, or join a call if that would be useful.\n\nWhat\'s the feel from the team so far?', timing:'Schedule · Day 3', goal:'Check internal progress' } },
]


const STATUS_STYLES: Record<string,{border:string;bg:string;badge:string;text:string;icon:any}> = {
  'Stalling':     {border:'border-red-500/40',   bg:'bg-red-500/5',   badge:'bg-red-500 text-white',   text:'text-red-400',   icon:AlertTriangle},
  'At Risk':      {border:'border-amber-500/40', bg:'bg-amber-500/5', badge:'bg-amber-500 text-white', text:'text-amber-400', icon:AlertTriangle},
  'On Track':     {border:'border-blue-500/40',  bg:'bg-blue-500/5',  badge:'bg-blue-500 text-white',  text:'text-blue-400',  icon:CheckCircle},
  'Accelerating': {border:'border-teal-500/40',  bg:'bg-teal-500/5',  badge:'bg-teal-500 text-white',  text:'text-teal-400',  icon:TrendingUp},
}

function ScoreBar({label,score}:{label:string;score:number}) {
  const color = score>=80?'bg-teal-500':score>=60?'bg-blue-500':score>=40?'bg-amber-500':'bg-red-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-semibold text-white">{score}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{width:`${score}%`}}/>
      </div>
    </div>
  )
}

export default function AccelerateTab() {
  const [loading, setLoading] = useState(false)
  const [deals, setDeals] = useState<typeof MOCK_DEALS|null>(null)
  const [openPlaybook, setOpenPlaybook] = useState<string|null>(null)
  const [activeFilter, setActiveFilter] = useState<string|null>(null)
  const [copied, setCopied] = useState<string|null>(null)
  const [sent, setSent] = useState<string|null>(null)

  function handleScore() {
    setLoading(true)
    setTimeout(() => { setDeals(MOCK_DEALS); setLoading(false) }, 2200)
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id); setTimeout(() => setCopied(null), 2000)
  }

  function handleSend(id: string) {
    setSent(id); setTimeout(() => setSent(null), 2500)
  }

  const statusOrder: Record<string,number> = {'Stalling':0,'At Risk':1,'On Track':2,'Accelerating':3}
  const sorted = deals ? [...deals].sort((a,b) => statusOrder[a.status]-statusOrder[b.status]) : []
  const filtered = activeFilter ? sorted.filter(d => d.status===activeFilter) : sorted

  const totalValue = deals ? deals.reduce((s,d) => s+d.deal_value, 0) : 0
  const atRiskValue = deals ? deals.filter(d => d.status==='Stalling'||d.status==='At Risk').reduce((s,d) => s+d.deal_value, 0) : 0

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white mb-1">Ignite — live pipeline intelligence</h2>
        <p className="text-slate-400 text-sm">Score every active deal across six health dimensions — then surface exactly what to do next.</p>
      </div>

      {!deals ? (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={28} className="text-teal-500"/>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Score your live pipeline</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-2">SignalOps analyses every active deal across six health dimensions — engagement, stakeholder breadth, commitment depth, stage velocity, meeting momentum, and champion signal.</p>
          <p className="text-slate-500 text-xs max-w-md mx-auto mb-6 italic">Every deal follows a pattern. When it deviates, that&apos;s your signal.</p>
          <button onClick={handleScore} disabled={loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-70 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Scoring pipeline...</>
              : <><TrendingUp size={16}/>Score live pipeline →</>}
          </button>
        </div>
      ) : (
        <div>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Total pipeline value</p>
              <p className="text-2xl font-bold text-white">€{(totalValue/1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500">{deals.length} active deals</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">At risk or stalling</p>
              <p className="text-2xl font-bold text-red-400">€{(atRiskValue/1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500">{deals.filter(d=>d.status==='Stalling'||d.status==='At Risk').length} deals need action now</p>
            </div>
            <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Accelerating</p>
              <p className="text-2xl font-bold text-teal-400">{deals.filter(d=>d.status==='Accelerating').length} deals</p>
              <p className="text-xs text-slate-500">€{(deals.filter(d=>d.status==='Accelerating').reduce((s,d)=>s+d.deal_value,0)/1000).toFixed(0)}k in strong position</p>
            </div>
          </div>

          {/* Filter cards */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {(['Stalling','At Risk','On Track','Accelerating'] as const).map(s => {
              const count = deals.filter(d => d.status===s).length
              const st = STATUS_STYLES[s]
              const Icon = st.icon
              const isActive = activeFilter===s
              return (
                <button key={s} onClick={() => setActiveFilter(activeFilter===s ? null : s)}
                  className={`border ${st.border} ${st.bg} rounded-xl p-3 text-left transition-all ${isActive?'ring-2 ring-offset-1 ring-offset-[#0F172A] scale-105 shadow-lg':'hover:shadow-md'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5"><Icon size={13} className={st.text}/><span className="text-xs text-slate-400">{s}</span></div>
                    {isActive && <span className="text-xs text-slate-500">✕</span>}
                  </div>
                  <p className={`text-2xl font-bold ${st.text}`}>{count}</p>
                  <p className="text-xs text-slate-500">{isActive?'click to clear':'click to filter'}</p>
                </button>
              )
            })}
          </div>

          {activeFilter && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Showing</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[activeFilter].badge}`}>{activeFilter}</span>
              <span className="text-xs text-slate-400">deals only</span>
              <button onClick={() => setActiveFilter(null)} className="text-xs text-slate-500 hover:text-white underline ml-1">Clear filter</button>
            </div>
          )}

          {/* Deal list */}
          <div className="space-y-3">
            {filtered.map(deal => {
              const st = STATUS_STYLES[deal.status]
              const Icon = st.icon
              const isOpen = openPlaybook === deal.id
              const isPositive = deal.status==='Accelerating'||deal.status==='On Track'

              return (
                <div key={deal.id} className={`border ${st.border} ${st.bg} rounded-2xl overflow-hidden`}>
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-white">{deal.company}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${st.badge}`}>{deal.status}</span>
                          <span className="text-xs text-slate-500">{deal.stage}</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{deal.contact} · {deal.title} · Day {deal.days_in_stage} of ~{deal.avg_days_won} avg · €{deal.deal_value.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 italic">{deal.top_signal}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-2xl font-bold ${st.text}`}>{deal.health_score}</p>
                        <p className="text-xs text-slate-500">health</p>
                      </div>
                    </div>

                    {deal.risk_flags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {deal.risk_flags.map(f => (
                          <span key={f} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle size={10}/>{f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Next action + Open Playbook button — matches Recover pattern */}
                    <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between gap-3 ${isPositive ? 'bg-teal-500/5 border-teal-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <Zap size={13} className={`${st.text} flex-shrink-0 mt-0.5`}/>
                          <div>
                            <p className={`text-xs font-semibold ${st.text} mb-0.5`}>Next action</p>
                            <p className="text-xs text-slate-300">{deal.next_action}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenPlaybook(isOpen ? null : deal.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex-shrink-0 ${
                          isOpen
                            ? 'bg-teal-500 text-white'
                            : 'bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20'
                        }`}
                      >
                        <BookOpen size={12}/>
                        {isOpen ? 'Close' : 'Open playbook'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded playbook — health breakdown + email sequence */}
                  {isOpen && (
                    <div className="border-t border-slate-700/50 p-4 space-y-4">
                      {/* Health scores */}
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Health breakdown</p>
                        <div className="grid grid-cols-2 gap-3">
                          <ScoreBar label="Engagement velocity" score={deal.engagement_score}/>
                          <ScoreBar label="Stakeholder breadth" score={deal.stakeholder_score}/>
                          <ScoreBar label="Commitment depth" score={deal.commitment_score}/>
                          <ScoreBar label="Stage velocity" score={deal.velocity_score}/>
                        </div>
                      </div>

                      {/* Email sequence */}
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Outreach sequence</p>
                        <div className="space-y-3">
                          {([['email1', deal.email1], ['email2', deal.email2]] as const).map(([key, data], i) => (
                            <div key={key} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-slate-400">Email {i + 1}</span>
                                  <span className="text-xs text-slate-500">· {data.timing}</span>
                                  <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{data.goal}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => copy(`Subject: ${data.subject}\n\n${data.body}`, `${deal.id}-${key}`)}
                                    className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1 transition-colors">
                                    {copied === `${deal.id}-${key}` ? <><CheckCircle size={11}/>Copied</> : <><Copy size={11}/>Copy</>}
                                  </button>
                                  {i === 0 ? (
                                    <button
                                      onClick={() => handleSend(`${deal.id}-${key}`)}
                                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                        sent === `${deal.id}-${key}`
                                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                      }`}>
                                      {sent === `${deal.id}-${key}` ? <><CheckCircle size={11}/>Sent ✓</> : <><Send size={11}/>Send</>}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleSend(`${deal.id}-${key}`)}
                                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                        sent === `${deal.id}-${key}`
                                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                                      }`}>
                                      {sent === `${deal.id}-${key}` ? <><CheckCircle size={11}/>Scheduled ✓</> : <><Send size={11}/>Schedule</>}
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs font-semibold text-white mb-2">Subject: {data.subject}</p>
                              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{data.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
