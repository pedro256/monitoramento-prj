

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  email character varying UNIQUE,
  user_id uuid,
  CONSTRAINT organizations_pkey PRIMARY KEY (id),
  CONSTRAINT organization_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);


CREATE TABLE public.devices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid,
  name text NOT NULL,
  model text,
  location text,
  api_token uuid DEFAULT gen_random_uuid() UNIQUE,
  status text DEFAULT 'offline'::text,
  last_heartbeat timestamp with time zone,
  settings jsonb DEFAULT '{"temp_max": 80, "press_max": 100}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT devices_pkey PRIMARY KEY (id),
  CONSTRAINT devices_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  device_id uuid,
  severity text CHECK (severity = ANY (ARRAY['info'::text, 'warning'::text, 'critical'::text])),
  message text NOT NULL,
  resolved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT alerts_pkey PRIMARY KEY (id),
  CONSTRAINT alerts_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id)
);
CREATE TABLE public.telemetry_logs (
  id bigint,
  device_id uuid,
  payload jsonb NOT NULL,
  temperature numeric,
  pressure numeric,
  cycle_count integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT telemetry_logs_pkey PRIMARY KEY (id),
  CONSTRAINT telemetry_logs_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id)
);