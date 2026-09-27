// @ts-nocheck
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const CREDS_FILE = path.join(__dirname, '..', '.auth', 'credentials.json');

test.describe('Login Automation - automationexercise.com', () => {
  let credentials;

  test.beforeAll(() => {
    // Read credentials saved by the registration setup
    const raw = fs.readFileSync(CREDS_FILE, 'utf-8');
    credentials = JSON.parse(raw);
    console.log(`📧 Using email: ${credentials.email}`);
  });

  test('Should login successfully with registered credentials', async ({ page }) => {
    // Step 1: Launch the website
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);
    console.log('✅ Website launched successfully');

    // Step 2: Navigate to Login page
    await page.click('a[href="/login"]');
    await expect(page.locator('.login-form h2')).toContainText('Login to your account');
    console.log('✅ Navigated to Login page');

    // Step 3: Enter registered email and password
    await page.locator('.login-form input[name="email"]').fill(credentials.email);
    await page.locator('.login-form input[name="password"]').fill(credentials.password);
    console.log('✅ Credentials entered');

    // Step 4: Submit the login form
    await page.locator('button[data-qa="login-button"]').click();
    console.log('✅ Login form submitted');

    // Step 5: Verify login was successful
    // Check that "Logged in as <username>" is visible in the navbar
    const loggedInLink = page.locator('a:has-text("Logged in as")');
    await expect(loggedInLink).toBeVisible();

    const loggedInText = await loggedInLink.textContent();
    expect(loggedInText).toContain(credentials.name);
    console.log(`✅ Login verified — ${loggedInText?.trim()}`);

    // Additional verification: ensure we're on the home page
    await expect(page.locator('.features_items')).toBeVisible();
    console.log('✅ Home page content loaded — login fully successful!');
  });

  test('Should fail login with incorrect password', async ({ page }) => {
    // Negative test: verify that wrong credentials show an error
    await page.goto('/login');
    await page.locator('.login-form input[name="email"]').fill(credentials.email);
    await page.locator('.login-form input[name="password"]').fill('WrongPassword123');
    await page.locator('button[data-qa="login-button"]').click();

    // Should show error message
    const errorMsg = page.locator('p[style="color: red;"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Your email or password is incorrect!');
    console.log('✅ Negative test passed — incorrect credentials show error');
  });
});
