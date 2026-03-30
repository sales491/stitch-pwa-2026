/**
 * supabase-admin.mjs
 * 
 * A direct Supabase admin runner using the service role key from .env.local.
 * Bypasses RLS completely. Use for seeding, migrations, and data fixes.
 * 
 * Usage:
 *   node supabase-admin.mjs list-faqs
 *   node supabase-admin.mjs insert-faq "category" "Question?" "Answer."
 *   node supabase-admin.mjs update-faq "old question text" "New question?" "New answer."
 *   node supabase-admin.mjs delete-faq "question text"
 *   node supabase-admin.mjs query "faqs" "category" "operator"
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Load .env.local manually (dotenv handles this, but this is zero-dep) ──
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
}

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Service role client — full admin access, bypasses RLS
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const [,, command, ...args] = process.argv;

// ── Commands ──────────────────────────────────────────────────────────────────

async function listFaqs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('id, category, question, answer')
    .order('category')
    .order('created_at');

  if (error) { console.error('❌', error.message); return; }

  const grouped = {};
  for (const faq of data) {
    if (!grouped[faq.category]) grouped[faq.category] = [];
    grouped[faq.category].push(faq);
  }

  for (const [cat, faqs] of Object.entries(grouped)) {
    console.log(`\n── ${cat.toUpperCase()} (${faqs.length}) ──`);
    for (const faq of faqs) {
      console.log(`  [${faq.id.slice(0,8)}] Q: ${faq.question}`);
      console.log(`           A: ${faq.answer.slice(0, 80)}...`);
    }
  }
  console.log(`\n✅ Total: ${data.length} FAQs`);
}

async function insertFaq(category, question, answer) {
  if (!category || !question || !answer) {
    console.error('Usage: node supabase-admin.mjs insert-faq "category" "Question?" "Answer."');
    return;
  }
  const { data, error } = await supabase
    .from('faqs')
    .insert({ category, question, answer })
    .select()
    .single();

  if (error) { console.error('❌', error.message); return; }
  console.log(`✅ Inserted FAQ [${data.id.slice(0,8)}] in category '${data.category}'`);
  console.log(`   Q: ${data.question}`);
}

async function updateFaq(oldQuestion, newQuestion, newAnswer) {
  if (!oldQuestion || !newQuestion || !newAnswer) {
    console.error('Usage: node supabase-admin.mjs update-faq "old question" "new question" "new answer"');
    return;
  }
  const { data, error } = await supabase
    .from('faqs')
    .update({ question: newQuestion, answer: newAnswer, updated_at: new Date().toISOString() })
    .eq('question', oldQuestion)
    .select()
    .single();

  if (error) { console.error('❌', error.message); return; }
  console.log(`✅ Updated FAQ [${data.id.slice(0,8)}]`);
  console.log(`   New Q: ${data.question}`);
}

async function deleteFaq(question) {
  if (!question) {
    console.error('Usage: node supabase-admin.mjs delete-faq "question text"');
    return;
  }
  const { error, count } = await supabase
    .from('faqs')
    .delete({ count: 'exact' })
    .eq('question', question);

  if (error) { console.error('❌', error.message); return; }
  console.log(`✅ Deleted ${count} FAQ(s) matching: "${question}"`);
}

async function queryTable(table, filterCol, filterVal) {
  let q = supabase.from(table).select('*');
  if (filterCol && filterVal) q = q.eq(filterCol, filterVal);
  const { data, error } = await q;
  if (error) { console.error('❌', error.message); return; }
  console.table(data);
  console.log(`✅ ${data.length} rows`);
}

// ── Router ────────────────────────────────────────────────────────────────────

switch (command) {
  case 'list-faqs':     await listFaqs(); break;
  case 'insert-faq':    await insertFaq(args[0], args[1], args[2]); break;
  case 'update-faq':    await updateFaq(args[0], args[1], args[2]); break;
  case 'delete-faq':    await deleteFaq(args[0]); break;
  case 'query':         await queryTable(args[0], args[1], args[2]); break;
  default:
    console.log(`
Supabase Admin Runner
─────────────────────
Commands:
  list-faqs                                     List all FAQs grouped by category
  insert-faq <category> <question> <answer>     Insert a new FAQ
  update-faq <old_question> <new_q> <new_a>     Update an existing FAQ by matching question
  delete-faq <question>                         Delete a FAQ by question text
  query <table> [filter_col] [filter_val]       Raw table query
`);
}
