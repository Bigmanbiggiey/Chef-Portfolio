// One-time migration: seeds the Supabase `gallery_photos` and `services`
// tables with the content that's currently hardcoded as a fallback in
// Gallery.jsx / Services.jsx, so the tables are never empty. Without this,
// the first admin-added row causes those components to switch from
// "render the hardcoded fallback" to "render only what's in the DB",
// which looks like the original content disappeared.
//
// Safe to re-run: skips a table entirely if it already has rows.
//
// Usage: node --env-file=.env scripts/seed-content.mjs
//   (or: npm run seed)
// Requires VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, '../src/assets');
const BUCKET = 'site-media';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.');
  console.error('Run with: node --env-file=.env scripts/seed-content.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function uploadAsset(folder, filename) {
  const buffer = readFileSync(path.join(ASSETS_DIR, filename));
  const storagePath = `${folder}/seed-${filename}`;
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${filename}: ${error.message}`);
  return storagePath;
}

async function seedGallery() {
  const { count, error: countError } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact', head: true });
  if (countError) throw new Error(`Could not check gallery_photos: ${countError.message}`);
  if (count > 0) {
    console.log(`gallery_photos already has ${count} row(s) — skipping to avoid duplicates.`);
    return;
  }

  const dishes = ['dish2.jpg', 'dish3.jpg', 'dish4.jpg', 'dish5.jpg'];
  for (let i = 0; i < dishes.length; i++) {
    const storagePath = await uploadAsset('gallery', dishes[i]);
    const { error } = await supabase.from('gallery_photos').insert({ image_path: storagePath, sort_order: i });
    if (error) throw new Error(`Insert failed for ${dishes[i]}: ${error.message}`);
    console.log(`Seeded gallery photo: ${dishes[i]}`);
  }
}

async function seedServices() {
  const { count, error: countError } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });
  if (countError) throw new Error(`Could not check services: ${countError.message}`);
  if (count > 0) {
    console.log(`services already has ${count} row(s) — skipping to avoid duplicates.`);
    return;
  }

  const services = [
    { file: 'chama.jpg', title: 'Meal Prep / Chama Events', description: 'Nutritious, home‑style meals prepped fresh for groups or chama meetups.' },
    { file: 'outside-cater.jpg', title: 'Outside Catering', description: 'Tailored menus and full catering setup for all kinds of gatherings.' },
    { file: 'birth-grad.jpg', title: 'Birthday & Graduation Parties', description: 'Celebrate milestones with festive, flavorful dishes.' },
    { file: 'wedd-ruracio.jpg', title: 'Weddings / Ruracio', description: 'Elegant culinary service for your big day or traditional ceremonies.' },
    { file: 'culinary-facilitator.jpg', title: 'Culinary Facilitation', description: 'Expert culinary training for schools, institutions, or community events.' },
    { file: 'menu-prod.jpg', title: 'Menu Production', description: 'Creative, customized menu design for events and businesses.' },
    { file: 'Event-prod.jpg', title: 'Event Production', description: 'Full‑scale planning and execution of food‑based events and experiences.' },
  ];

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    const storagePath = await uploadAsset('services', s.file);
    const { error } = await supabase.from('services').insert({
      title: s.title,
      description: s.description,
      image_path: storagePath,
      sort_order: i,
    });
    if (error) throw new Error(`Insert failed for ${s.title}: ${error.message}`);
    console.log(`Seeded service: ${s.title}`);
  }
}

await seedGallery();
await seedServices();
console.log('Done.');
