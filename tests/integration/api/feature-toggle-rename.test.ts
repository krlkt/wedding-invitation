/**
 * T007: Contract test - PUT /api/wedding/config/features with renamed toggle
 *
 * Tests the renamed feature toggle (instagram_link -> instagram_links)
 * Reference: specs/008-split-instagram-links/contracts/api-feature-toggle.yaml
 *
 * Expected: THESE TESTS SHOULD FAIL until T017 is implemented
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

describe('PUT /api/wedding/config/features - Renamed Instagram Toggle', () => {
  let sessionCookie: string;
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

  beforeEach(async () => {
    sessionCookie = 'test-session-cookie';
  });

  it('should accept instagram_links feature name when enabling', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config/features`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        featureName: 'instagram_links',
        isEnabled: true,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.featureName).toBe('instagram_links');
    expect(data.data.isEnabled).toBe(true);
  });

  it('should accept instagram_links feature name when disabling', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config/features`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        featureName: 'instagram_links',
        isEnabled: false,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.featureName).toBe('instagram_links');
    expect(data.data.isEnabled).toBe(false);
  });

  it('should reject old instagram_link feature name with 400 error', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config/features`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        featureName: 'instagram_link', // Old name (singular)
        isEnabled: true,
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid feature name');
  });

  it('should return correct feature name in response', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config/features`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        featureName: 'instagram_links',
        isEnabled: true,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveProperty('featureName');
    expect(data.data.featureName).toBe('instagram_links');
  });

  it('should work correctly after multiple toggles', async () => {
    // Enable
    let response = await fetch(`${baseUrl}/api/wedding/config/features`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        featureName: 'instagram_links',
        isEnabled: true,
      }),
    });
    expect(response.status).toBe(200);

    // Disable
    response = await fetch(`${baseUrl}/api/wedding/config/features`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        featureName: 'instagram_links',
        isEnabled: false,
      }),
    });
    expect(response.status).toBe(200);

    // Enable again
    response = await fetch(`${baseUrl}/api/wedding/config/features`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        featureName: 'instagram_links',
        isEnabled: true,
      }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
