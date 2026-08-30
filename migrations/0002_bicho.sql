create table if not exists profiles (
  user_id text primary key,
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);
create table if not exists draws (
  id serial primary key,
  scheduled_at timestamptz not null unique,
  status text not null,
  winning_number integer,
  drawn_at timestamptz
);
create table if not exists tickets (
  id serial primary key,
  user_id text not null,
  draw_id integer not null references draws (id),
  animal_number integer not null,
  status text not null,
  price_cents integer not null,
  pix_txid text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  unique (draw_id, animal_number)
);
