import { Router, type Request, type Response } from 'express';

export interface AuditRequestBody {
  hotelName?: string;
  hotelType?: string;
  location?: string;
  challenge?: string;
  targetAudience?: string;
}

export interface ConsultRequestBody {
  name?: string;
  email?: string;
  hotelName?: string;
  date?: string;
  time?: string;
  notes?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildFallbackAuditReport(hotelName?: string): string {
  const safeName = hotelName?.trim() || 'Bespoke Resort';
  return `### Luxury Digital Audit: ${safeName}

*Note: Server API Key is not configured yet. This is a curated preview report for Camera Cloud.*

1. **Chapter 1: Visual Storytelling & Asset Strategy**
   - **Architectural Immersion**: Focus on natural sunlight patterns, showcasing transitions from golden hour to dusk. Create slow-panning, cinematic video shoots of your open spaces, curated art pieces, and custom linen textures.
   - **Drone Cinematography**: High-altitude flyovers transitioning into intimate terrace reveals, emphasizing isolation, exclusivity, and landscape integration.

2. **Chapter 2: High-Converting Digital Presence & UX/Web Development**
   - **Sensory Interaction**: Implement scroll-driven video backdrops with high-contrast serif headers (*Cormorant Garamond*). Simplify the check-availability widget into a seamless, elegant 1-step overlay instead of redirecting users to external booking engine domains prematurely.
   - **Speed and Polish**: Eliminate clutter, and optimize image-loading with advanced prefetching.

3. **Chapter 3: Premium Performance Marketing**
   - **Exclusivity Hooks**: Target high-net-worth individuals in regional capitals through curated Meta/Pinterest campaigns featuring 'The Secret Escape' narratives rather than direct discount-led rates.

4. **Chapter 4: Direct Booking Growth Playbook**
   - **Value-Add Packaging**: Promote custom guest itineraries (private beach dinners, customized wellness rituals) exclusive to direct channels, ensuring rate parity with OTAs is maintained while delivering superior reservation value.`;
}

export function createApiRouter(): Router {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'camera-cloud-web',
      aiConfigured: Boolean(process.env['GEMINI_API_KEY']),
    });
  });

  router.post('/audit', async (req: Request, res: Response) => {
    try {
      const body = (req.body ?? {}) as AuditRequestBody;
      const { hotelName, hotelType, location, challenge, targetAudience } = body;

      const apiKey = process.env['GEMINI_API_KEY'];
      if (!apiKey) {
        return res.status(200).json({
          report: buildFallbackAuditReport(hotelName),
        });
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const model = process.env['GEMINI_MODEL'] || 'gemini-2.5-flash';

      const promptText = `Generate a highly professional, luxury-level digital marketing growth audit for the following hospitality brand:

- **Hotel/Resort Name**: ${hotelName || 'Bespoke Luxury Retreat'}
- **Property Type**: ${hotelType || 'Boutique Hotel'}
- **Location**: ${location || 'Secluded Coastline'}
- **Target Audience**: ${targetAudience || 'High-net-worth couples, leisure travelers'}
- **Primary Marketing Challenge**: ${challenge || 'Increasing direct bookings and reducing dependency on OTAs (Booking.com/Expedia)'}

Please structure the audit into 4 highly-actionable, premium chapters (each with concrete recommendations):
1. **Chapter 1: Visual Storytelling & Asset Strategy (Photography/Cinematic Video)**: Describe specific creative concepts for photo and video shoots that capture the property's soul, mood, and architecture.
2. **Chapter 2: High-Converting Digital Presence & UX/Web Development**: Pinpoint UX/UI gaps and how a bespoke luxury website can drive direct booking conversions (using elegant typography, immersive visuals, simplified reservation flow).
3. **Chapter 3: Premium Performance Marketing & Social Media Strategy**: Tactical ad hooks for Instagram/Facebook/Pinterest, targeting high-net-worth individuals, and organic content ideas.
4. **Chapter 4: Booking Funnel Optimization & Direct-Booking Growth Playbook**: How to compete with OTAs, leverage exclusive packages, customized high-end newsletters, and custom value propositions.

Use elegant, professional, luxury hospitality tone (inspired by top agencies like Stripe, Apple, Framer, and elite hotel brands). Format using clean Markdown with distinct headers. Avoid generic marketing buzzwords; provide highly tailored, bespoke ideas for this specific property. Do not use markdown codeblocks within the text, just return structured markdown directly.`;

      const response = await ai.models.generateContent({
        model,
        contents: promptText,
        config: {
          systemInstruction:
            "You are a master digital growth strategist and visual director at Camera Cloud, a luxury hospitality marketing agency. Your audits are deeply bespoke, highly detailed, visually descriptive, and inspiring. Write in an authoritative, editorial, and elegant tone.",
          temperature: 0.7,
        },
      });

      const report = response.text || 'No strategy generated.';
      return res.status(200).json({ report });
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Gemini API error during audit:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate audit strategy.',
      });
    }
  });

  router.post('/consult', (req: Request, res: Response) => {
    const body = (req.body ?? {}) as ConsultRequestBody;
    const { name, email, hotelName, date, time, notes } = body;

    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      typeof email !== 'string' ||
      !EMAIL_PATTERN.test(email.trim()) ||
      typeof hotelName !== 'string' ||
      hotelName.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        error: 'Valid name, email, and hotelName are required.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Consultation booked successfully!',
      details: {
        name: name.trim(),
        email: email.trim(),
        hotelName: hotelName.trim(),
        date,
        time,
        notes,
        meetingId: 'CC-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
      },
    });
  });

  return router;
}
