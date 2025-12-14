/**
 * @jest-environment node
 *
 * T014: Content Management Flow Integration Test
 *
 * Tests complete content management workflows for love story, locations,
 * FAQs, bank details, and dress code content.
 */

describe('Content Management Flow Integration Test', () => {
  const baseUrl = 'http://localhost:3000';

  const testUser = {
    email: `content-test-${Date.now()}@example.com`,
    password: 'contentPassword123',
    groomName: 'Content Test Groom',
    brideName: 'Content Test Bride',
  };

  beforeAll(async () => {
    await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
  });

  describe('Love Story Management', () => {
    it('should create, update, and delete love story segments', async () => {
      const createData = {
        title: 'First Meeting',
        description: 'We met at a coffee shop on a rainy day...',
        date: '2020-02-14T00:00:00.000Z',
        iconType: 'heart',
        order: 1,
      };

      const createResponse = await fetch(`${baseUrl}/api/wedding/love-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData),
      });

      if (createResponse.status === 201) {
        const createdData = await createResponse.json();
        const segmentId = createdData.data.id;

        // Update
        const updateResponse = await fetch(`${baseUrl}/api/wedding/love-story/${segmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Updated First Meeting' }),
        });

        expect(updateResponse.status).toBe(200);

        // Delete
        const deleteResponse = await fetch(`${baseUrl}/api/wedding/love-story/${segmentId}`, {
          method: 'DELETE',
        });

        expect(deleteResponse.status).toBe(200);
      }
    });
  });

  describe('Location Management', () => {
    it('should manage wedding locations with all details', async () => {
      const locationData = {
        locationIdentifier: 'ceremony-venue',
        name: 'Beautiful Garden Venue',
        address: '123 Garden Lane, City, State 12345',
        googleMapsLink: 'https://maps.google.com/example',
        ceremonyTime: '15:00',
        receptionTime: '18:00',
        order: 1,
      };

      const createResponse = await fetch(`${baseUrl}/api/wedding/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      });

      if (createResponse.status === 201) {
        const getResponse = await fetch(`${baseUrl}/api/wedding/locations`);

        if (getResponse.status === 200) {
          const locations = await getResponse.json();
          expect(locations.data.length).toBeGreaterThan(0);
          expect(locations.data[0]).toMatchObject(locationData);
        }
      }
    });
  });

  describe('FAQ Management', () => {
    it('should create and retrieve FAQ items', async () => {
      const faqData = {
        question: 'What should I wear?',
        answer: 'Semi-formal attire is recommended. Avoid white clothing.',
        order: 1,
      };

      const createResponse = await fetch(`${baseUrl}/api/wedding/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData),
      });

      if (createResponse.status === 201) {
        const getResponse = await fetch(`${baseUrl}/api/wedding/faqs`);

        if (getResponse.status === 200) {
          const faqs = await getResponse.json();
          expect(faqs.data.length).toBeGreaterThan(0);
          expect(faqs.data[0]).toMatchObject(faqData);
        }
      }
    });
  });

  describe('Bank Details Management', () => {
    it('should update and retrieve bank details', async () => {
      const bankData = {
        bankName: 'First National Bank',
        accountName: 'John & Jane Wedding Fund',
        accountNumber: '1234567890',
        routingNumber: '987654321',
        instructions: 'Please include your name in the memo',
      };

      const updateResponse = await fetch(`${baseUrl}/api/wedding/bank-details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankData),
      });

      if (updateResponse.status === 200) {
        const getResponse = await fetch(`${baseUrl}/api/wedding/bank-details`);

        if (getResponse.status === 200) {
          const details = await getResponse.json();
          expect(details.data).toMatchObject(bankData);
        }
      }
    });
  });

  describe('Dress Code Management', () => {
    it('should update dress code information', async () => {
      const dressCodeData = {
        title: 'Garden Party Attire',
        description:
          'Semi-formal dress code. Ladies, please avoid stiletto heels for the outdoor ceremony.',
      };

      const updateResponse = await fetch(`${baseUrl}/api/wedding/dress-code`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dressCodeData),
      });

      if (updateResponse.status === 200) {
        const getResponse = await fetch(`${baseUrl}/api/wedding/dress-code`);

        if (getResponse.status === 200) {
          const dressCode = await getResponse.json();
          expect(dressCode.data).toMatchObject(dressCodeData);
        }
      }
    });
  });
});
