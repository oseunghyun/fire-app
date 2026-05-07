alter table public.households
  add constraint households_owner_id_key unique (owner_id);
