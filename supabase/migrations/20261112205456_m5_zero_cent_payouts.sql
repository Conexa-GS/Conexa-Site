begin;
-- RN34 rounds each item to cents. A valid positive quantity/price can produce
-- a zero-cent producer total. Preserve one simulated record per beneficiary
-- without inventing a minimum charge or blocking an already paid delivery.
alter table public.simulated_payouts
  drop constraint simulated_payouts_amount_cents_check;
alter table public.simulated_payouts
  add constraint simulated_payouts_amount_cents_check check (amount_cents >= 0);
commit;
