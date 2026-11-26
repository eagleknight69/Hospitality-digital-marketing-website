import express from 'express';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApiRouter } from '../src/api.routes';

describe('Express API routes', () => {
  let server: Server;
  let baseUrl: string;
  const originalApiKey = process.env['GEMINI_API_KEY'];

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use('/api', createApiRouter());

    server = createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve());
    });
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  beforeEach(() => {
    delete process.env['GEMINI_API_KEY'];
  });

  afterAll(async () => {
    if (originalApiKey !== undefined) {
      process.env['GEMINI_API_KEY'] = originalApiKey;
    } else {
      delete process.env['GEMINI_API_KEY'];
    }
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('GET /api/health returns service status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      status: string;
      service: string;
      aiConfigured: boolean;
    };
    expect(body).toEqual({
      status: 'ok',
      service: 'camera-cloud-web',
      aiConfigured: false,
    });
  });

  it('POST /api/audit returns fallback growth report when GEMINI_API_KEY is unset', async () => {
    const res = await fetch(`${baseUrl}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelName: 'Aurora Lake Palace',
        hotelType: 'Heritage Palace',
        location: 'Udaipur, India',
        challenge: 'Reducing OTA dependency',
        targetAudience: 'Luxury heritage travelers',
      }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as { report: string };
    expect(body.report).toContain('Luxury Digital Audit: Aurora Lake Palace');
    expect(body.report).toContain('Chapter 4: Direct Booking Growth Playbook');
  });

  it('POST /api/consult books a consultation with a generated meeting ID', async () => {
    const res = await fetch(`${baseUrl}/api/consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '  Aarav Mehta ',
        email: 'aarav@heritagepalace.example',
        hotelName: 'Heritage Palace Udaipur',
        date: '2026-07-06',
        time: '14:00',
        notes: 'Interested in drone production and direct booking redesign',
      }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      success: boolean;
      message: string;
      details: { name: string; hotelName: string; meetingId: string };
    };
    expect(body.success).toBe(true);
    expect(body.details.name).toBe('Aarav Mehta');
    expect(body.details.hotelName).toBe('Heritage Palace Udaipur');
    expect(body.details.meetingId).toMatch(/^CC-[A-Z0-9]+$/);
  });

  it('POST /api/consult rejects invalid or incomplete payloads with 400', async () => {
    const res = await fetch(`${baseUrl}/api/consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A',
        email: 'not-an-email',
        hotelName: '',
      }),
    });

    expect(res.status).toBe(400);
    const body = (await res.json()) as { success: boolean; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain('required');
  });
});
