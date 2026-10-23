import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const htmlPath = path.resolve(process.cwd(), 'index.html');

test('index.html exists and is non-empty', () => {
  assert.equal(fs.existsSync(htmlPath), true);
  const content = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(content.length > 500, 'HTML content should be substantial');
});

test('Font loading conforms strictly to rules', () => {
  const content = fs.readFileSync(htmlPath, 'utf8');
  const fontLinks = content.match(/fonts\.googleapis\.com\/css2\?[^"']+/g) || [];
  assert.equal(fontLinks.length, 1, 'Must load only ONE Google Font stylesheet');
  assert.ok(fontLinks[0].includes('Inter'), 'Must include Inter');
  assert.ok(fontLinks[0].includes('Plus+Jakarta+Sans') || fontLinks[0].includes('Manrope'), 'Must include Plus Jakarta Sans or Manrope');
});

test('All required sections and exact copy strings are present', () => {
  const content = fs.readFileSync(htmlPath, 'utf8');

  // Section 0: Top Brand Logo (centered above REWARDS PROGRAM)
  assert.ok(content.includes('top-logo-container'), 'Missing top-logo-container element');
  assert.ok(content.includes('top-logo-picture'), 'Missing top-logo-picture wrapper element');
  assert.ok(content.includes('assets/tiktok_roblox_transparent'), 'Missing transparent logo asset reference');
  assert.ok(fs.existsSync(path.resolve(process.cwd(), 'public/assets/tiktok_roblox_transparent.png')), 'Local tiktok_roblox_transparent.png must exist');
  assert.ok(
    content.indexOf('top-logo-container') < content.indexOf('REWARDS PROGRAM'),
    'Top logo must be positioned above "REWARDS PROGRAM"'
  );
  assert.ok(content.includes('justify-content: center'), 'Logo container must center its contents');

  // Section 1: Top label
  assert.ok(content.includes('REWARDS PROGRAM'), 'Missing top label "REWARDS PROGRAM"');

  // Section 2: Hero card
  assert.equal(content.includes('YOUR REWARD'), false, 'Should not contain "YOUR REWARD"');
  assert.ok(content.includes('Unlock up to'), 'Missing headline line 1 "Unlock up to"');
  assert.ok(content.includes('$100 in Robux'), 'Missing "$100 in Robux"');
  // Restyled Robux Reward Card graphic in hero
  assert.ok(content.includes('Robux Reward'), 'Missing caption "Robux Reward"');
  assert.ok(content.includes('reward-card-sleeve'), 'Missing reward-card-sleeve element');
  assert.ok(content.includes('card-glare'), 'Missing card-glare element');
  assert.ok(content.includes('assets/roblox-card'), 'Missing roblox-card image reference');
  assert.ok(fs.existsSync(path.resolve(process.cwd(), 'public/assets/roblox-card.png')), 'Local roblox-card.png must exist');
  assert.ok(content.includes('rotateY(-15deg)'), 'Must include 3D perspective rotateY(-15deg)');
  assert.ok(content.includes('rotateZ(12deg)'), 'Must include clockwise tilt rotateZ(12deg)');
  assert.ok(content.includes('glareSweep'), 'Must include glare sweep animation');
  assert.equal(content.includes('animation: cardFloat'), false, 'cardFloat bobbing animation must be removed');
  assert.equal(content.includes('animation: figureFloat'), false, 'figureFloat bobbing animation must be removed');
  assert.equal(content.includes('animation: shadowPulse'), false, 'shadowPulse bobbing animation must be removed');

  // Featured figure in illustration
  assert.ok(content.includes('Headless Horseman'), 'Missing "Headless Horseman" title');
  assert.ok(content.includes('Avatar inspiration'), 'Missing "Avatar inspiration" subtitle');
  assert.ok(content.includes('figure-ground-shadow'), 'Missing ground shadow under figure');
  assert.ok(content.includes('figure-img'), 'Missing figure image class');
  assert.ok(fs.existsSync(path.resolve(process.cwd(), 'public/assets/figure.png')), 'Local figure.png must exist');

  // Section 3: Divider sparkle
  assert.ok(content.includes('divider'), 'Missing divider section');

  // Section 4: How it works & Steps
  assert.ok(content.includes('How it works'), 'Missing "How it works" heading');
  assert.ok(content.includes('01'), 'Missing step 01');
  assert.ok(content.includes('Tap "Get Started"'), 'Missing step 01 title');
  assert.ok(content.includes('Click the button below to begin your offer.'), 'Missing step 01 desc');
  assert.ok(content.includes('02'), 'Missing step 02');
  assert.ok(content.includes('Complete the qualifying steps'), 'Missing step 02 title');
  assert.ok(content.includes('Follow the offer requirements shown on the next page.'), 'Missing step 02 desc');
  assert.ok(content.includes('03'), 'Missing step 03');
  assert.ok(content.includes('Redeem your reward'), 'Missing step 03 title');
  assert.ok(content.includes('Finish verification and follow the redemption instructions.'), 'Missing step 03 desc');

  // Primary CTA Button
  assert.ok(content.includes('Get Started'), 'Missing "Get Started" CTA text');
  assert.ok(content.includes('TRACKING_LINK_HERE'), 'Missing "TRACKING_LINK_HERE"');

  // Section 6: FAQ
  assert.ok(content.includes('A FEW THINGS TO KNOW'), 'Missing FAQ eyebrow "A FEW THINGS TO KNOW"');
  assert.ok(content.includes('Before you start.'), 'Missing FAQ heading "Before you start."');
  assert.ok(content.includes('How long does it take?'), 'Missing FAQ Q1');
  assert.ok(content.includes('Completion time depends on the offer requirements and verification.'), 'Missing FAQ A1');
  assert.ok(content.includes('Who is eligible?'), 'Missing FAQ Q2');
  assert.ok(content.includes('Eligibility depends on the requirements shown during the promotional flow.'), 'Missing FAQ A2');
  assert.ok(content.includes('How do I receive the reward?'), 'Missing FAQ Q3');
  assert.ok(content.includes('After completing the qualifying requirements, follow the redemption instructions provided for the promotion.'), 'Missing FAQ A3');

  // Section 7: Footer
  assert.ok(content.includes('TikTok and Roblox are trademarks of their respective owners.'), 'Missing footer trademark disclosure');
  assert.ok(!content.includes('<div class="footer-label">REWARDS PROGRAM</div>'), 'Footer must not contain "REWARDS PROGRAM"');
});

test('Color Theme: Near-black #0b0a10, amber/orange gradient #f6c27a -> #ee9a4d, and violet #8b6bb8', () => {
  const content = fs.readFileSync(htmlPath, 'utf8');

  // Near-black background
  assert.ok(content.includes('#0b0a10'), 'Must use near-black #0b0a10');

  // Amber/orange gradient
  assert.ok(content.includes('#f6c27a'), 'Must use amber #f6c27a');
  assert.ok(content.includes('#ee9a4d'), 'Must use orange #ee9a4d');

  // Muted violet secondary accent
  assert.ok(content.includes('#8b6bb8'), 'Must use violet #8b6bb8');

  // Step number top-to-bottom progression gradients
  assert.ok(
    content.includes('linear-gradient(180deg, #f6c27a 0%, #ee9a4d 100%)'),
    'Step 01 must use top-to-bottom warm amber gradient (#f6c27a -> #ee9a4d)'
  );
  assert.ok(
    content.includes('linear-gradient(180deg, #f4a073 0%, #e27a8a 100%)'),
    'Step 02 must use top-to-bottom coral/rose gradient (#f4a073 -> #e27a8a)'
  );
  assert.ok(
    content.includes('linear-gradient(180deg, #c48ad6 0%, #8b6bb8 100%)'),
    'Step 03 must use top-to-bottom soft violet gradient (#c48ad6 -> #8b6bb8)'
  );
  assert.ok(content.includes('<div class="step-number step-number-01">01</div>'), 'Step 01 must have step-number-01 class');
  assert.ok(content.includes('<div class="step-number step-number-02">02</div>'), 'Step 02 must have step-number-02 class');
  assert.ok(content.includes('<div class="step-number step-number-03">03</div>'), 'Step 03 must have step-number-03 class');
});

test('Strict Copy Rules: No prohibited marketing scam words appear', () => {
  const content = fs.readFileSync(htmlPath, 'utf8').toLowerCase();

  const prohibited = [
    '\\bfree\\b',
    '\\binstant\\b',
    '\\bguaranteed\\b',
    'limited time',
    '\\bhurry\\b',
    'ends soon',
    'last chance',
    'only \\d+ left',
    'takes \\d+ minutes',
    'no purchase',
    'no spending required',
  ];

  for (const pattern of prohibited) {
    const regex = new RegExp(pattern, 'i');
    const match = content.match(regex);
    assert.equal(match, null, `Found prohibited word or phrase matching: ${pattern}`);
  }
});

test('CTA Buttons: Only one button in page after steps and one sticky button', () => {
  const content = fs.readFileSync(htmlPath, 'utf8');
  const ctaLinks = content.match(/<a[^>]*class="[^"]*cta-button[^"]*"[^>]*>/g) || [];
  assert.equal(ctaLinks.length, 2, 'Must have exactly 2 buttons: one in-page and one sticky');

  // Verify the in-page button is in .secondary-cta-wrapper (after steps)
  assert.ok(content.includes('<div class="secondary-cta-wrapper">\n        <a href="TRACKING_LINK_HERE" class="cta-button"'));

  // Verify the sticky button is in .sticky-bottom-bar
  assert.ok(content.includes('<div class="sticky-bottom-bar" role="complementary" aria-label="Quick action">\n      <div class="sticky-bottom-inner">\n        <a href="TRACKING_LINK_HERE" class="cta-button"'));

  for (const link of ctaLinks) {
    assert.ok(link.includes('href="TRACKING_LINK_HERE"'), 'CTA link must point to TRACKING_LINK_HERE');
    assert.ok(!link.includes('target="_blank"'), 'CTA link must NOT have target="_blank"');
  }

  // Verify text in the button is centered in the middle
  assert.ok(content.includes('justify-content: center;'), 'Button must center content');
  assert.ok(content.includes('text-align: center;'), 'Button text must be centered');

  // Verify sticky button is controlled by observer
  assert.ok(content.includes('IntersectionObserver'), 'Must use IntersectionObserver for sticky visibility');
  assert.ok(content.includes('is-hidden'), 'Must have is-hidden toggle for sticky visibility');
});

test('Click Tracking: Config block, URL/URLSearchParams, sessionStorage, whitelist, and debug mode', () => {
  const content = fs.readFileSync(htmlPath, 'utf8');

  // 1. CONFIG at top of script
  assert.ok(
    content.includes('const OFFER_URL = "https://giftclick.org/aff_c?offer_id=2500&aff_id=200476";'),
    'Must define exact OFFER_URL constant'
  );
  assert.ok(content.includes('const PARAM_MAP = {'), 'Must define PARAM_MAP constant');
  assert.ok(content.includes('sub1: "aff_sub"'), 'Must map sub1 to aff_sub');
  assert.ok(content.includes('sub2: "aff_sub2"'), 'Must map sub2 to aff_sub2');
  assert.ok(content.includes('sub3: "aff_sub3"'), 'Must map sub3 to aff_sub3');
  assert.ok(content.includes('ttclid: "aff_sub4"'), 'Must map ttclid to aff_sub4');
  assert.ok(content.includes('const DEFAULT_SOURCE = "direct";'), 'Must define DEFAULT_SOURCE = "direct"');

  // 2. Uses sessionStorage wrapped in try/catch and URL / URLSearchParams
  assert.ok(content.includes('sessionStorage'), 'Must persist tracking params in sessionStorage');
  assert.ok(content.includes('new URL(OFFER_URL)'), 'Must construct URL from OFFER_URL');
  assert.ok(content.includes('new URLSearchParams(window.location.search)'), 'Must parse window.location.search with URLSearchParams');
  assert.ok(content.includes("pageParams.get('debug') === '1'"), 'Must support ?debug=1 hidden debug box');
});

test('In-App Browser Escape: UA detection, Android intent, iOS x-safari scheme, fallback overlay, and debug info', () => {
  const content = fs.readFileSync(htmlPath, 'utf8');

  // 1. User-Agent detection tokens & flags
  const requiredTokens = [
    '"musical_ly"',
    '"BytedanceWebview"',
    '"TikTok"',
    '"trill"',
    '"Instagram"',
    '"FBAN"',
    '"FBAV"',
  ];
  for (const token of requiredTokens) {
    assert.ok(content.includes(token), `Must check navigator.userAgent for ${token}`);
  }
  assert.ok(content.includes('isInApp'), 'Must store isInApp detection result');
  assert.ok(content.includes('isIOS'), 'Must store isIOS detection result');
  assert.ok(content.includes('isAndroid'), 'Must store isAndroid detection result');

  // 2. Android intent and iOS x-safari-https scheme + 1500ms visibilityState check
  assert.ok(
    content.includes('#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='),
    'Must build Android Chrome intent URL with S.browser_fallback_url'
  );
  assert.ok(content.includes('x-safari-https://'), 'Must try x-safari-https:// scheme on iOS');
  assert.ok(content.includes('document.visibilityState === "visible"'), 'Must check document.visibilityState === "visible"');
  assert.ok(content.includes('1500'), 'Must wait 1500ms before showing fallback overlay');

  // 3. Fallback overlay copy and controls
  assert.ok(content.includes('Open in your browser to continue'), 'Missing overlay title "Open in your browser to continue"');
  assert.ok(
    content.includes("Tap ••• in the top-right corner, then choose 'Open in browser'."),
    'Missing overlay instruction text'
  );
  assert.ok(content.includes('>Copy link</button>'), 'Missing "Copy link" secondary button');
  assert.ok(content.includes('Copied ✓'), 'Missing "Copied ✓" state');
  assert.ok(content.includes('Then paste it into Safari or Chrome.'), 'Missing "Then paste it into Safari or Chrome." instruction');
  assert.ok(content.includes('Continue here instead'), 'Missing "Continue here instead" text link');
  assert.ok(content.includes('>×</button>'), 'Missing close (×) button');

  // 4. Debug mode methods
  assert.ok(content.includes('"normal"'), 'Must include "normal" method in debug info');
  assert.ok(content.includes('"Android intent"'), 'Must include "Android intent" method in debug info');
  assert.ok(content.includes('"iOS x-safari"'), 'Must include "iOS x-safari" method in debug info');
  assert.ok(content.includes('"overlay"'), 'Must include "overlay" method in debug info');
});


