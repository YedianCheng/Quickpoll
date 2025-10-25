# 🎨 QuickPoll Video - Visual Guide

## 📺 Screen-by-Screen Breakdown

---

## Scene 1: Introduction (0:00 - 0:20)

### What to Show:
```
┌─────────────────────────────────────┐
│  🗳️ QuickPoll                       │
│  GitHub README (top section)        │
│                                     │
│  - Project title                    │
│  - Badges (Linera, Rust, React)    │
│  - Live Demo section                │
│  - Architecture diagram             │
└─────────────────────────────────────┘
```

### Actions:
1. Open browser to: `https://github.com/YedianCheng/Quickpoll`
2. Scroll slowly through README
3. Pause on architecture diagram

### What to Say:
> "Hello! I'm presenting QuickPoll..."

---

## Scene 2: Architecture (0:20 - 0:50)

### What to Show:
```
┌─────────────────────────────────────┐
│  Architecture Diagram:              │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │   User   │  │   Poll   │       │
│  │  Chain   │◄─┤  Chain   │       │
│  └──────────┘  └──────────┘       │
│       ▲              ▲              │
│       │    ┌──────────┐            │
│       └────┤  Oracle  │            │
│            │  Chain   │            │
│            └──────────┘            │
└─────────────────────────────────────┘
```

### Actions:
1. Stay on README architecture section
2. Or open `DEPLOYMENT_INFO.md` 
3. Slowly move cursor to highlight each chain

### What to Say:
> "QuickPoll uses three specialized microchains..."

---

## Scene 3: User Interface (0:50 - 1:50)

### What to Show:

#### 3.1 Market List (0:50 - 1:05)
```
┌─────────────────────────────────────┐
│  🗳️ QuickPoll    [Connect Wallet]   │
├─────────────────────────────────────┤
│  Search: [___________] 🔍           │
│                                     │
│  Categories: [All] [Politics] ...   │
├─────────────────────────────────────┤
│  📊 Bitcoin $100k by 2024?          │
│     Yes 65% | No 35% | Vol: $230   │
├─────────────────────────────────────┤
│  🏛️ US Government Shutdown?         │
│     Yes 71% | No 29% | Vol: $170   │
└─────────────────────────────────────┘
```

**Actions:**
- Open `http://localhost:3000`
- Scroll through markets
- Hover over different categories

**Say:**
> "Here's the user interface, inspired by Polymarket..."

---

#### 3.2 Market Detail (1:05 - 1:25)
```
┌─────────────────────────────────────┐
│  ← Back to Markets                  │
├─────────────────────────────────────┤
│  Will Bitcoin reach $100k by 2024? │
│                                     │
│  📊 Current Probability:            │
│     ████████████░░░░ 65% YES       │
│     ██████░░░░░░░░░░ 35% NO        │
│                                     │
│  💰 Total Volume: $230              │
│  📅 Ends: Dec 31, 2024              │
│  📂 Category: Crypto                │
├─────────────────────────────────────┤
│  [Vote Yes] [Vote No]               │
└─────────────────────────────────────┘
```

**Actions:**
- Click on a market card
- Point to probability bars
- Point to volume and end date

**Say:**
> "Each market shows real-time probability..."

---

#### 3.3 Wallet Connection (1:25 - 1:35)
```
┌─────────────────────────────────────┐
│  Connect to Linera Wallet           │
│                                     │
│  🔐 Linera Wallet                   │
│     [Connect]                       │
│                                     │
│  ⚠️ Make sure you have Linera      │
│     wallet extension installed      │
└─────────────────────────────────────┘
```

**Actions:**
- Click "Connect Wallet" button
- Show connection dialog
- (Wallet connects or shows mock)

**Say:**
> "Users connect their Linera wallet to participate..."

---

#### 3.4 Voting (1:35 - 1:50)
```
┌─────────────────────────────────────┐
│  Vote on Market                     │
│                                     │
│  Amount: [100] tokens               │
│  Choice: ● Yes  ○ No               │
│                                     │
│  [Confirm Vote]                     │
│                                     │
│  ✅ Vote submitted successfully!    │
│     Probability updated: 65% → 67% │
└─────────────────────────────────────┘
```

**Actions:**
- Click "Vote Yes"
- Enter amount: 100
- Click confirm
- Show success notification

**Say:**
> "Let's vote Yes with 100 tokens..."

---

## Scene 4: Admin Panel (1:50 - 2:30)

### What to Show:

#### 4.1 Admin Login (1:50 - 2:00)
```
┌─────────────────────────────────────┐
│  Admin Login                        │
│                                     │
│  Password: [••••••]                 │
│            [Login]                  │
└─────────────────────────────────────┘
```

**Actions:**
- Click "Admin Login" (top right)
- Type password: `admin`
- Press Enter

**Say:**
> "QuickPoll features a comprehensive admin panel..."

---

#### 4.2 Admin Dashboard (2:00 - 2:15)
```
┌─────────────────────────────────────┐
│  👑 Admin Panel         [Logout]    │
├─────────────────────────────────────┤
│  📊 Statistics:                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │ 3  │ │ 2  │ │ 2  │ │10  │      │
│  │User│ │Act │ │Pend│ │Mkt │      │
│  └────┘ └────┘ └────┘ └────┘      │
└─────────────────────────────────────┘
```

**Actions:**
- Show admin dashboard
- Point to each statistic

**Say:**
> "Admins see platform statistics..."

---

#### 4.3 Pending Markets (2:15 - 2:25)
```
┌─────────────────────────────────────┐
│  Pending Markets for Review         │
├─────────────────────────────────────┤
│  ❓ Will AI replace all jobs?       │
│     Creator: bob_trader             │
│     [Approve] [Reject]              │
├─────────────────────────────────────┤
│  ❓ ETH to $5000 by 2024?           │
│     Creator: eve_investor           │
│     [Approve] [Reject]              │
└─────────────────────────────────────┘
```

**Actions:**
- Scroll to pending markets
- Hover over approve button
- (Optional: click approve)

**Say:**
> "Users submit markets for review. Admins can approve or reject..."

---

#### 4.4 User Management (2:25 - 2:30)
```
┌─────────────────────────────────────┐
│  User Management                    │
├─────────────────────────────────────┤
│  👤 alice_crypto (verified_user)    │
│     Status: Active                  │
│     [Suspend]                       │
├─────────────────────────────────────┤
│  👤 bob_trader (user)               │
│     Status: Pending                 │
│     [Activate]                      │
└─────────────────────────────────────┘
```

**Actions:**
- Scroll to user management
- Show user list

**Say:**
> "Admins can manage accounts and monitor reputation..."

---

## Scene 5: Technical Info (2:30 - 2:50)

### What to Show:

#### Option A: Terminal
```
┌─────────────────────────────────────┐
│  $ linera wallet show               │
│                                     │
│  Chain ID: d1e24f0f84eb7b5a...     │
│  Account Owner: 0xf1708614d4d6...  │
│  Block Height: 2                    │
│  Status: Active                     │
│                                     │
│  $ linera query-application ...     │
└─────────────────────────────────────┘
```

#### Option B: DEPLOYMENT_INFO.md
```
┌─────────────────────────────────────┐
│  🚀 Conway Testnet Deployment       │
│                                     │
│  ✅ Status: SUCCESSFUL              │
│  📋 Chain ID: d1e24f0f...           │
│  📋 App ID: 5088003121...           │
│  🌐 Network: Conway Testnet         │
│  🔧 SDK: v0.15.4                    │
└─────────────────────────────────────┘
```

**Actions:**
- Open terminal OR `DEPLOYMENT_INFO.md`
- Highlight Chain ID and App ID

**Say:**
> "The application is deployed on Conway Testnet..."

---

## Scene 6: Conclusion (2:50 - 3:00)

### What to Show:
```
┌─────────────────────────────────────┐
│  GitHub Repository                  │
│  github.com/YedianCheng/Quickpoll  │
│                                     │
│  ⭐ Star the project!               │
│  📖 Read the docs                   │
│  🚀 Try it yourself                 │
│                                     │
│  Built with:                        │
│  • Linera SDK v0.15.4              │
│  • Rust + React + TypeScript       │
└─────────────────────────────────────┘
```

**Actions:**
- Return to GitHub repo
- Scroll to top
- Show README badges

**Say:**
> "QuickPoll demonstrates Linera's microchain architecture..."

---

## 🎬 Recording Flow Summary

```
1. GitHub README (20s)
   ↓
2. Architecture Diagram (30s)
   ↓
3. Frontend Demo (60s)
   - Market list
   - Market detail
   - Wallet connect
   - Vote
   ↓
4. Admin Panel (40s)
   - Login
   - Dashboard
   - Pending markets
   - User management
   ↓
5. Technical Info (20s)
   - Terminal or docs
   ↓
6. GitHub Repo (10s)
```

**Total: 2-3 minutes**

---

## 💡 Pro Tips for Smooth Recording

### Mouse Movement:
- ✅ Move slowly and deliberately
- ✅ Pause on important elements (2 seconds)
- ✅ Circle important text with cursor
- ❌ Don't move too fast or erratically

### Transitions:
- Use ⌘+Tab (Mac) or Alt+Tab (Windows) to switch apps
- Or keep everything in browser tabs
- Pause 1 second between transitions

### If You Make a Mistake:
- Pause for 5 seconds
- Start that section again
- Edit out the mistake later

---

**Good luck! You got this! 🚀**

