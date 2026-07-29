-- Schema local alinhado ao uso em runtime (frontend BFF + backend EF/COPY)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(150) NOT NULL,
  email varchar(150) UNIQUE,
  user_id uuid,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id),
  CONSTRAINT organization_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.devices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid,
  name text NOT NULL,
  model text,
  location text,
  api_token uuid DEFAULT gen_random_uuid() UNIQUE,
  _status text DEFAULT 'offline',
  last_heartbeat timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT devices_pkey PRIMARY KEY (id),
  CONSTRAINT devices_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE
);

CREATE TABLE public.telemetric_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  device_id uuid,
  severity text NOT NULL CHECK (severity = ANY (ARRAY['info'::text, 'warning'::text, 'critical'::text])),
  message text NOT NULL,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT telemetric_alerts_pkey PRIMARY KEY (id),
  CONSTRAINT telemetric_alerts_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE
);

CREATE TABLE public.telemetry_logs (
  id bigint GENERATED ALWAYS AS IDENTITY,
  device_id uuid,
  cycle_count integer,
  created_at timestamptz DEFAULT now(),
  tag varchar(100),
  value numeric,
  unity varchar(50),
  CONSTRAINT telemetry_logs_pkey PRIMARY KEY (id),
  CONSTRAINT telemetry_logs_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_organizations_user_id ON public.organizations (user_id);
CREATE INDEX idx_devices_organization_id ON public.devices (organization_id);
CREATE INDEX idx_telemetry_device_id ON public.telemetry_logs (device_id);
CREATE INDEX idx_telemetry_created_at ON public.telemetry_logs (created_at DESC);
CREATE INDEX idx_alerts_device_id ON public.telemetric_alerts (device_id);
CREATE INDEX idx_alerts_resolved ON public.telemetric_alerts (resolved) WHERE resolved = false;
