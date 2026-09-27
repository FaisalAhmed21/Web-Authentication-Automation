# Web Authentication Automation

Automated web authentication testing for [automationexercise.com](https://www.automationexercise.com/) using **Playwright** — a modern end-to-end testing framework.

This project automates the full authentication flow: **user registration → login verification → error handling**, with realistic Bangladeshi identity generation for each test run.

---

## Features

- **Automated User Registration** — Creates a fresh account with realistic Bangladeshi credentials on every run
- **Login Verification** — Logs in with registered credentials and verifies successful authentication
- **Negative Testing** — Validates that incorrect passwords are properly rejected
- **Human-like Data** — Generates realistic Bangladeshi names, addresses, phone numbers, and emails
- **Slow Motion Mode** — Runs with visible delays (800ms) so you can watch each step
- **HTML Reports** — Auto-generates detailed test reports after each run

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation & testing framework |
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| Chromium | Test browser |

## Project Structure

```
Web-Authentication-Automation/
├── tests/
│   ├── register.setup.js    # Registers a new account (runs first)
│   └── login.spec.js        # Login tests (positive + negative)
├── playwright.config.js     # Playwright configuration
├── package.json             # Dependencies & scripts
├── .gitignore               # Ignored files
└── README.md                # Documentation
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FaisalAhmed21/Web-Authentication-Automation.git
   cd Web-Authentication-Automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

### Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (with browser visible) |
| `npm run test:headed` | Run all tests in headed mode |
| `npm run test:login` | Run only the login tests |
| `npm run test:setup` | Run only the registration setup |
| `npm run report` | Open the HTML test report |

## Test Flow

```
1. Register (Setup)
   ├── Navigate to automationexercise.com
   ├── Click "Signup / Login"
   ├── Fill signup form with generated Bangladeshi identity
   ├── Complete registration with address, phone, company
   ├── Verify "Account Created!" confirmation
   ├── Confirm "Logged in as <name>" in navbar
   ├── Save credentials to .auth/credentials.json
   └── Logout

2. Login — Positive Test
   ├── Navigate to automationexercise.com
   ├── Go to Login page
   ├── Enter registered email & password
   ├── Submit login form
   ├── Verify "Logged in as <name>" in navbar
   └── Confirm home page content loads

3. Login — Negative Test
   ├── Navigate to Login page
   ├── Enter registered email with wrong password
   ├── Submit login form
   └── Verify error message: "Your email or password is incorrect!"
```

## 🇧🇩 Sample Generated Identity

Each test run creates a unique Bangladeshi identity:

```
✅ Account created successfully!
   Name:  Tanvir Chowdhury
   Email: tanvir.chowdhury47@gmail.com
   From:  Dhanmondi, Dhaka
   Phone: 01752384691
```

**Data includes:**
- Bangladeshi male names (Rahim, Tanvir, Sabbir, Rakib, Fahim, etc.)
- Real areas (Mirpur, Dhanmondi, Uttara, Gulshan, Banani, etc.)
- Cities (Dhaka, Chittagong, Sylhet, Khulna, Rajshahi)
- BD mobile format (017/018/019/016/015/013 + 8 digits)
- Bangladeshi companies (Grameenphone, BRAC IT, Pathao, Chaldal, etc.)

## Configuration

The automation runs with these settings in `playwright.config.js`:

| Setting | Value | Purpose |
|---------|-------|---------|
| `slowMo` | 800ms | Delay between actions for visibility |
| `headless` | false | Browser window is visible |
| `timeout` | 120s | Max time per test |
| `viewport` | 1280×720 | Browser window size |

## Test Report

After running tests, view the HTML report:

```bash
npm run report
```

This opens a detailed report at `http://localhost:9323` showing pass/fail status, execution time, and error screenshots for any failures.
