import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json()); // Enable JSON parsing for API requests

const angularApp = new AngularNodeAppEngine();

/**
 * Camera Cloud Custom API routes for Consultation Booking & Gemini Growth Audit
 */
app.post('/api/audit', async (req, res) => {
  try {
    const { hotelName, hotelType, location, challenge, targetAudience } = req.body;
    
    // Check Gemini API Key
    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      return res.status(200).json({ 
        report: `### Luxury Digital Audit: ${hotelName || 'Bespoke Resort'}

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
   - **Value-Add Packaging**: Promote custom guest itineraries (private beach dinners, customized wellness rituals) exclusive to direct channels, ensuring rate parity with OTAs is maintained while delivering superior reservation value.` 
      });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

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
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are a master digital growth strategist and visual director at Camera Cloud, the world's leading luxury hospitality marketing agency. Your audits are deeply bespoke, highly detailed, visually descriptive, and incredibly inspiring. You write in an authoritative, editorial, and elegant tone.",
        temperature: 0.7,
      }
    });

    const report = response.text || "No strategy generated.";
    return res.json({ report });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Gemini API error during audit:", err);
    return res.status(500).json({ error: err.message || "Failed to generate audit strategy." });
  }
});

app.post('/api/consult', (req, res) => {
  const { name, email, hotelName, date, time, notes } = req.body;
  
  return res.json({
    success: true,
    message: "Consultation booked successfully!",
    details: {
      name,
      email,
      hotelName,
      date,
      time,
      notes,
      meetingId: "CC-" + Math.random().toString(36).substring(2, 11).toUpperCase()
    }
  });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
