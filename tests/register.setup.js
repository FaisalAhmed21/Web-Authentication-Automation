// @ts-nocheck
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────
// Bangladeshi identity generator
// ──────────────────────────────────────────────
const FIRST_NAMES_MALE = [
  'Rahim', 'Karim', 'Tanvir', 'Sabbir', 'Mehedi', 'Rakib', 'Fahim',
  'Shakil', 'Arif', 'Nayeem', 'Jubayer', 'Rifat', 'Saiful', 'Imran',
  'Hasan', 'Sohel', 'Mahfuz', 'Rezaul', 'Ashraf', 'Mamun',
];

const FIRST_NAMES_FEMALE = [
  'Fatema', 'Tasnia', 'Nusrat', 'Jannatul', 'Sadia', 'Farhana', 'Tamanna',
  'Sharmin', 'Afsana', 'Maliha', 'Lamia', 'Sumaiya', 'Nadia', 'Taslima',
  'Raisa', 'Nawshin', 'Sumona', 'Ishrat', 'Habiba', 'Ruma',
];

const LAST_NAMES = [
  'Hossain', 'Ahmed', 'Islam', 'Rahman', 'Alam', 'Uddin', 'Khan',
  'Chowdhury', 'Molla', 'Sarker', 'Miah', 'Siddique', 'Haque', 'Kamal',
  'Bhuiyan', 'Talukder', 'Mondal', 'Biswas', 'Akter', 'Begum',
];

const COMPANIES = [
  'Bashundhara Group', 'Grameenphone Ltd', 'BRAC IT Services', 'Pathao Ltd',
  'Chaldal Tech', 'Sheba Platform', 'DataSoft Systems', 'TigerIT Bangladesh',
  'Robi Axiata', 'Brain Station 23',
];

const AREAS = [
  { area: 'Mirpur', city: 'Dhaka', zip: '1216' },
  { area: 'Dhanmondi', city: 'Dhaka', zip: '1205' },
  { area: 'Uttara', city: 'Dhaka', zip: '1230' },
  { area: 'Gulshan', city: 'Dhaka', zip: '1212' },
  { area: 'Mohammadpur', city: 'Dhaka', zip: '1207' },
  { area: 'Banani', city: 'Dhaka', zip: '1213' },
  { area: 'Motijheel', city: 'Dhaka', zip: '1000' },
  { area: 'Agrabad', city: 'Chittagong', zip: '4100' },
  { area: 'Kazir Dewri', city: 'Chittagong', zip: '4000' },
  { area: 'Shahjalal Upashahar', city: 'Sylhet', zip: '3100' },
  { area: 'Sonadanga', city: 'Khulna', zip: '9100' },
  { area: 'Godnail', city: 'Narayanganj', zip: '1400' },
  { area: 'Sadar', city: 'Rajshahi', zip: '6000' },
];

const ROADS = [
  'Road No. 5', 'Road No. 11', 'Road No. 8', 'Lane 3', 'Gali No. 2',
  'Main Road', 'Station Road', 'College Road', 'Masjid Road', 'Bazar Road',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
}

function generateIdentity() {
  const firstName = pick(FIRST_NAMES_MALE);
  const lastName = pick(LAST_NAMES);
  const location = pick(AREAS);

  const separator = pick(['.', '_', '']);
  const tag = randomDigits(Math.random() > 0.5 ? 2 : 3);
  const domain = pick(['gmail.com', 'yahoo.com', 'outlook.com']);
  const email = `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${tag}@${domain}`;
  const password = `${firstName}@${randomDigits(4)}!`;

  const birthDay = String(Math.floor(Math.random() * 28) + 1);
  const birthMonth = String(Math.floor(Math.random() * 12) + 1);
  const birthYear = String(Math.floor(Math.random() * 15) + 1985);

  // Bangladeshi mobile: 01X-XXXXXXXX
  const prefix = pick(['017', '018', '019', '016', '015', '013']);
  const phone = `${prefix}${randomDigits(8)}`;

  const houseNo = `${Math.floor(Math.random() * 200) + 1}`;
  const address = `House ${houseNo}, ${pick(ROADS)}, ${location.area}`;

  return {
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email,
    password,
    company: pick(COMPANIES),
    address,
    city: location.city,
    state: location.area,
    zip: location.zip,
    phone,
    birthDay,
    birthMonth,
    birthYear,
    gender: 'Mr',
  };
}

const IDENTITY = generateIdentity();
const CREDS_FILE = path.join(__dirname, '..', '.auth', 'credentials.json');

test('Register a new account on Automation Exercise', async ({ page }) => {
  fs.mkdirSync(path.dirname(CREDS_FILE), { recursive: true });

  // 1. Navigate to the website
  await page.goto('/');
  await expect(page).toHaveTitle(/Automation Exercise/);

  // 2. Click "Signup / Login"
  await page.click('a[href="/login"]');
  await expect(page.locator('.signup-form h2')).toBeVisible();

  // 3. Fill in Signup form
  await page.locator('.signup-form input[name="name"]').fill(IDENTITY.name);
  await page.locator('.signup-form input[name="email"]').fill(IDENTITY.email);
  await page.locator('.signup-form button[type="submit"]').click();

  // 4. Fill in the registration details
  await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();

  if (IDENTITY.gender === 'Mr') {
    await page.locator('#id_gender1').check();
  } else {
    await page.locator('#id_gender2').check();
  }

  await page.locator('#password').fill(IDENTITY.password);
  await page.locator('#days').selectOption(IDENTITY.birthDay);
  await page.locator('#months').selectOption(IDENTITY.birthMonth);
  await page.locator('#years').selectOption(IDENTITY.birthYear);

  // Address info — Bangladeshi details
  await page.locator('#first_name').fill(IDENTITY.firstName);
  await page.locator('#last_name').fill(IDENTITY.lastName);
  await page.locator('#company').fill(IDENTITY.company);
  await page.locator('#address1').fill(IDENTITY.address);
  await page.locator('#country').selectOption('India'); // Closest available to Bangladesh
  await page.locator('#state').fill(IDENTITY.state);
  await page.locator('#city').fill(IDENTITY.city);
  await page.locator('#zipcode').fill(IDENTITY.zip);
  await page.locator('#mobile_number').fill(IDENTITY.phone);

  // 5. Submit registration
  await page.locator('button[data-qa="create-account"]').click();

  // 6. Verify account creation
  await expect(page.locator('h2[data-qa="account-created"]')).toBeVisible();
  await expect(page.locator('h2[data-qa="account-created"]')).toContainText('Account Created!');

  // 7. Click Continue
  await page.locator('a[data-qa="continue-button"]').click();

  // 8. Verify logged in
  await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

  // 9. Save credentials for login test
  const savedCreds = { name: IDENTITY.name, email: IDENTITY.email, password: IDENTITY.password };
  fs.writeFileSync(CREDS_FILE, JSON.stringify(savedCreds, null, 2));
  console.log(`✅ Account created successfully!`);
  console.log(`   Name:  ${IDENTITY.name}`);
  console.log(`   Email: ${IDENTITY.email}`);
  console.log(`   From:  ${IDENTITY.state}, ${IDENTITY.city}`);
  console.log(`   Phone: ${IDENTITY.phone}`);

  // 10. Logout
  await page.click('a[href="/logout"]');
  await expect(page.locator('.login-form h2')).toBeVisible();
});
