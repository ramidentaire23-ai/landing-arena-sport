CREATE TABLE IF NOT EXISTS orders (
 id uuid PRIMARY KEY, reference text NOT NULL UNIQUE,
 request_hash text NOT NULL, receipt_hash text NOT NULL,
 status text NOT NULL CHECK (status IN ('creating','pending','accepted','rejected')),
 order_data jsonb NOT NULL, event_context jsonb NOT NULL, tracking text UNIQUE,
 accepted_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 dispatched_at timestamptz, carrier_state text NOT NULL DEFAULT 'created', delivered_at timestamptz, paid_at timestamptz,
 last_polled_at timestamptz, rejection_code text
);
CREATE TABLE IF NOT EXISTS meta_event_outbox (
 event_id text PRIMARY KEY, order_id uuid NOT NULL REFERENCES orders(id),
 event_name text NOT NULL, payload jsonb NOT NULL,
 state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','sent','dead')),
 attempts integer NOT NULL DEFAULT 0, next_attempt_at timestamptz NOT NULL DEFAULT now(),
 locked_until timestamptz, last_error_code text, sent_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS meta_outbox_due ON meta_event_outbox(state,next_attempt_at);
CREATE TABLE IF NOT EXISTS noest_history (
 event_hash text PRIMARY KEY, order_id uuid NOT NULL REFERENCES orders(id),
 event_key text, event_time timestamptz, raw jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS noest_reference_cache (
 id text PRIMARY KEY, payload jsonb NOT NULL, fetched_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatched_at timestamptz;

CREATE TABLE IF NOT EXISTS integration_jobs (
 name text PRIMARY KEY,
 lease_token uuid,
 lease_until timestamptz,
 next_run_at timestamptz NOT NULL DEFAULT now(),
 last_started_at timestamptz,
 last_completed_at timestamptz,
 last_error_code text
);
