# 🎬 QuickPoll Demo Video Script & Recording Guide

## 📹 Video Specifications

**Duration**: 2-3 minutes (ideal for Wave 1 submission)  
**Format**: MP4, 1080p (1920x1080)  
**Style**: Screen recording with voiceover (NO face cam needed)  
**Language**: English

---

## 🎥 Recording Tools (Choose One)

### Option 1: OBS Studio (Free, Professional)
- **Download**: https://obsproject.com/
- **Pros**: Free, high quality, customizable
- **Settings**: 1920x1080, 30fps, MP4 output

### Option 2: Loom (Easy, Web-based)
- **Website**: https://www.loom.com/
- **Pros**: Easy to use, auto-uploads, shareable link
- **Free tier**: Up to 5 min videos

### Option 3: macOS QuickTime (Built-in)
- **How**: Open QuickTime → File → New Screen Recording
- **Pros**: Simple, no installation needed
- **Note**: Need to add audio separately

### Option 4: ScreenFlow (Mac, Paid)
- **Website**: https://www.telestream.net/screenflow/
- **Pros**: Professional editing, easy to use

---

## 🎬 Video Structure (2-3 minutes)

### **Part 1: Introduction (20 seconds)**
```
[SHOW: GitHub README or project homepage]

"Hello! I'm presenting QuickPoll, a decentralized prediction market 
platform built on Linera blockchain for Wave 1 submission.

QuickPoll features a unique three-subchain architecture with separate 
chains for users, polls, and oracle services, deployed on Conway Testnet."
```

### **Part 2: Architecture Overview (30 seconds)**
```
[SHOW: Architecture diagram from README or draw on screen]

"QuickPoll uses three specialized microchains:
- User Chain: manages wallets, balances, and voting history
- Poll Chain: handles market data and order books
- Oracle Chain: verifies results from external data sources

These chains communicate through Linera's cross-chain messaging system."
```

### **Part 3: Live Demo - User Features (60 seconds)**
```
[SHOW: Frontend running at localhost:3000]

"Let me show you the user interface, inspired by Polymarket.

[Click through markets]
Here we have various prediction markets across categories: 
Politics, Crypto, Sports, and Finance.

[Click on a market]
Each market shows real-time probability calculations based on 
voting amounts. You can see the Yes/No percentages, total volume, 
and end date.

[Click 'Connect Wallet' button]
Users connect their Linera wallet to participate.

[Show wallet connection process]
Once connected, users can vote on any active market.

[Click 'Vote Yes' on a market]
Let's vote 'Yes' with 100 tokens on this Bitcoin market.

[Show confirmation]
The transaction is processed on-chain, and the probability 
updates in real-time."
```

### **Part 4: Admin Panel Demo (40 seconds)**
```
[Click 'Admin Login' button]

"QuickPoll also features a comprehensive admin panel.

[Enter password: 'admin']
Administrators can manage the entire platform.

[Show admin dashboard]
Here we see platform statistics: total users, active markets, 
and trading volume.

[Show 'Pending Markets' section]
Users submit new markets for review, and admins can approve 
or reject them.

[Show 'User Management' section]
Admins can also manage user accounts, suspend or activate users, 
and monitor reputation scores."
```

### **Part 5: Technical Highlights (20 seconds)**
```
[SHOW: Terminal or code editor with deployment info]

"The application is successfully deployed on Conway Testnet 
using Linera SDK v0.15.4.

[Show DEPLOYMENT_INFO.md or terminal]
Here's our Chain ID and Application ID on the testnet.

The smart contracts are written in Rust, and the frontend 
uses React with TypeScript."
```

### **Part 6: Conclusion (10 seconds)**
```
[SHOW: GitHub repository]

"QuickPoll demonstrates Linera's microchain architecture, 
cross-chain messaging, and GraphQL integration.

The project is open source on GitHub. Thank you for watching!"

[SHOW: Final screen with project info]
```

---

## 🎯 Recording Checklist

### Before Recording

- [ ] **Close unnecessary apps** (Slack, email, notifications)
- [ ] **Clean desktop** (hide personal files)
- [ ] **Prepare browser tabs**:
  - Tab 1: Frontend (localhost:3000)
  - Tab 2: GitHub repository
  - Tab 3: DEPLOYMENT_INFO.md
- [ ] **Test audio** (use built-in mic or headset)
- [ ] **Practice script** 2-3 times
- [ ] **Prepare demo data** (have some markets ready)
- [ ] **Set browser zoom** to 100% for clarity

### During Recording

- [ ] **Speak clearly and slowly** (English pronunciation)
- [ ] **Pause between sections** (easier to edit)
- [ ] **Move mouse smoothly** (not too fast)
- [ ] **Highlight important elements** (cursor or annotations)
- [ ] **Show, don't just tell** (click through features)

### After Recording

- [ ] **Review the video** (check audio sync)
- [ ] **Trim beginning/end** (remove dead space)
- [ ] **Add title slide** (optional, 3 seconds):
  ```
  QuickPoll
  Decentralized Prediction Market on Linera
  Wave 1 Submission
  ```
- [ ] **Export as MP4** (1080p, H.264 codec)
- [ ] **Upload to YouTube** (unlisted or public)
- [ ] **Test the link** (make sure it's accessible)

---

## 🎨 Visual Tips

### Screen Recording Best Practices

1. **Use Full Screen Mode**
   - Hide browser bookmarks bar
   - Hide macOS dock (auto-hide)
   - Use ⌘+Shift+F for full screen

2. **Cursor Highlighting** (Optional)
   - macOS: System Preferences → Accessibility → Display → Cursor
   - Or use Mouseposé app (paid)

3. **Annotations** (Optional)
   - Use OBS Studio overlays
   - Or edit in post with iMovie/Final Cut

4. **Smooth Transitions**
   - Don't jump between screens too fast
   - Pause 1-2 seconds after each action

---

## 🎤 Audio Tips

### Recording Setup

1. **Microphone Options**:
   - ✅ **Best**: External USB mic (Blue Yeti, Audio-Technica)
   - ✅ **Good**: Wired headset with mic
   - ⚠️ **OK**: AirPods/wireless earbuds
   - ❌ **Avoid**: Built-in laptop mic (if possible)

2. **Environment**:
   - Quiet room (no background noise)
   - Close windows (no street noise)
   - Turn off fans/AC if too loud

3. **Speaking Style**:
   - Speak at 80% of normal speed
   - Pronounce technical terms clearly
   - Pause between sentences
   - Smile while speaking (sounds friendlier!)

### Voiceover Script Tips

```
✅ DO:
- "Let me show you..." (engaging)
- "Here we can see..." (descriptive)
- "Notice how..." (highlighting)

❌ DON'T:
- "Um, uh, so..." (filler words)
- "I'm going to..." (too wordy)
- Reading code line by line (boring)
```

---

## 📤 Upload & Share

### YouTube Upload (Recommended)

1. **Create unlisted video** (not public if you prefer)
2. **Title**: "QuickPoll - Linera Prediction Market Demo (Wave 1)"
3. **Description**:
   ```
   QuickPoll: Decentralized Prediction Market Platform on Linera Blockchain
   
   Wave 1 Submission - October 2025
   
   Features:
   - Three-subchain architecture (User/Poll/Oracle)
   - Conway Testnet deployment
   - Polymarket-style UI
   - Real-time probability calculations
   - Admin management panel
   
   GitHub: https://github.com/YedianCheng/Quickpoll
   Chain ID: d1e24f0f84eb7b5a5b788f45b40d70e083488411eece8adfa811fe50998bdc7d
   Application ID: 5088003121860631e0b4162399b1ca680eac820ce28b904e942dccf61f9e1aec
   
   Built with: Linera SDK v0.15.4, Rust, React, TypeScript
   ```
4. **Tags**: linera, blockchain, prediction market, rust, react

### Alternative: Loom

- Auto-generates shareable link
- No YouTube account needed
- Easier for quick demos

---

## 🎬 Quick Start Recording Steps

### Using OBS Studio (Recommended)

1. **Download & Install** OBS Studio
2. **Create Scene**:
   - Add Source → Display Capture (for full screen)
   - Or Window Capture (for specific window)
3. **Settings**:
   - Output → Recording Format: MP4
   - Video → Base Resolution: 1920x1080
   - Video → FPS: 30
4. **Audio**:
   - Add Audio Input Capture (your microphone)
   - Test levels (speak and watch meter)
5. **Start Recording**:
   - Click "Start Recording"
   - Follow script
   - Click "Stop Recording"
6. **Find Video**: File → Show Recordings

### Using macOS QuickTime (Simplest)

1. **Open QuickTime Player**
2. **File → New Screen Recording**
3. **Click Options**:
   - Microphone: Select your mic
   - Show Mouse Clicks: Yes (optional)
4. **Click Record** → Select area or full screen
5. **Follow script**
6. **Stop**: Click stop button in menu bar
7. **File → Export As → 1080p**

---

## ✅ Final Checklist

Before submitting your video:

- [ ] Video is 2-3 minutes long
- [ ] Audio is clear (no background noise)
- [ ] All features are demonstrated
- [ ] GitHub link is shown
- [ ] Deployment info is mentioned
- [ ] Video is uploaded to YouTube/Loom
- [ ] Link is tested and accessible
- [ ] Video is in MP4 format (if downloading)

---

## 🎯 Pro Tips

### What Makes a Great Demo Video

✅ **DO**:
- Show real functionality (not mockups)
- Highlight unique features (three-chain architecture)
- Keep it concise (respect viewer's time)
- Use smooth mouse movements
- Pause after each action (let viewers absorb)

❌ **DON'T**:
- Show bugs or errors (edit them out)
- Apologize for anything ("sorry for my voice")
- Read documentation word-for-word
- Show personal information
- Make it too long (>5 minutes)

### Face Cam? NO! 

For technical demos, **screen-only is better**:
- ✅ Viewers focus on the product
- ✅ More professional look
- ✅ Easier to record (no camera setup)
- ✅ No worries about appearance/lighting

Face cams are good for:
- ❌ Vlogs, tutorials, personal content
- ❌ When building personal brand

---

**Good luck with your recording! 🎬🚀**

Remember: It doesn't have to be perfect on the first try. 
You can always record multiple takes and pick the best one!

