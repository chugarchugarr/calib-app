import fs from 'node:fs'

const source = fs.readFileSync(new URL('../src/AppMelius.jsx', import.meta.url), 'utf8')
const css = fs.readFileSync(new URL('../src/melius.css', import.meta.url), 'utf8')

const fail = (message) => {
  console.error(`✗ ${message}`)
  process.exitCode = 1
}

const pass = (message) => console.log(`✓ ${message}`)
const assert = (condition, message) => condition ? pass(message) : fail(message)

for (let id = 1; id <= 15; id += 1) {
  assert(new RegExp(`(?:^|[,\\s])${id}:'`).test(source), `pattern ${String(id).padStart(2, '0')} is present`)
}

assert(source.includes("'artist'") && source.includes("'orphan'"), 'Artist/Orphan model is present')
assert(source.includes("supabase.from('profiles')"), 'profiles persistence is present')
assert(source.includes("supabase.from('sessions')"), 'sessions persistence is present')
assert(source.includes("supabase.from('projects')"), 'projects persistence is present')
assert(source.includes('signInWithOtp'), 'account creation uses Supabase magic-link authentication')
assert(source.includes('Account required from this point'), 'account gate follows the discovery reveal')
assert(source.includes("save('calib:sessions'"), 'session local persistence is present')
assert(source.includes("save('calib:projects'"), 'project local persistence is present')
assert(source.includes('detectedPatterns') && source.includes('structuralPatterns') && source.includes('keywordPatterns'), 'deterministic pattern direction is present')
assert(source.includes('Future coaching belongs to human community'), 'human-community coaching direction is explicit')
assert(css.includes('Instrument Serif') && css.includes('background-image:linear-gradient'), 'editorial serif and technical grid are present')
assert(css.includes('--panel:#11110f') && css.includes('--orange:#e65f2b'), 'black operational panels and restrained orange actions are present')

const forbidden = [
  ['Stripe', /stripe/i],
  ['Pro tier state', /\bisPro\b|Upgrade to Pro|calib pro/i],
  ['payment logic', /payment/i],
  ['ten-session gate', /FREE_SESSION_LIMIT|free sessions used|free limit reached/i],
  ['AI coach', /AI coach/i],
]

for (const [label, pattern] of forbidden) {
  assert(!pattern.test(source), `${label} is absent`)
}

if (process.exitCode) {
  console.error('\nCalib preview verification failed.')
  process.exit(process.exitCode)
}

console.log('\nCalib preview invariants verified.')
