# stocks_app - TODO

## Inngest + Auth stability fixes
- [ ] Fix malformed braces / structure in `lib/inngest/functions.ts` (`sendDailyNewsSummary`)
- [ ] Refactor `lib/better-auth/auth.ts` to avoid `export const auth = await getAuth()` at module load
- [ ] Run `npm run lint` to catch TS/syntax errors
- [ ] Run `npm run build` to ensure Next build passes

## Session/Watchlist correctness
- [ ] Verify `session.user.id` usage matches `better-auth` session shape
- [ ] If mismatch, update watchlist/auth actions accordingly

## Dependency hygiene & performance
- [ ] Check whether dependencies `shadcn` / `cmdk` are actually used; remove/adjust if broken
- [ ] Add concurrency limiting in `inngest` daily news jobs (performance)
