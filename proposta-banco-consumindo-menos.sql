-- USERS
CREATE TABLE public.users (
  id            uuid          NOT NULL DEFAULT gen_random_uuid(),
  name          varchar(100)  NOT NULL,
  email         varchar(150)  NOT NULL UNIQUE,
  created_at    timestamptz   DEFAULT now(),

  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- ORGANIZATIONS
CREATE TABLE public.organizations (
  id            uuid          NOT NULL DEFAULT gen_random_uuid(),
  name          varchar(100)  NOT NULL,
  email         varchar(150)  UNIQUE,
  user_id       uuid,
  created_at    timestamptz   DEFAULT now(),

  CONSTRAINT organizations_pkey PRIMARY KEY (id),
  CONSTRAINT organization_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- DEVICES
CREATE TABLE public.devices (
  id              uuid          NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid,
  name            varchar(100)  NOT NULL,
  model           varchar(50),
  location        varchar(150),
  api_token       uuid          DEFAULT gen_random_uuid() UNIQUE,
  status          smallint      NOT NULL DEFAULT 0, -- 0=offline 1=online 2=maintenance
  last_heartbeat  timestamptz,
  temp_max        smallint      NOT NULL DEFAULT 80,
  press_max       smallint      NOT NULL DEFAULT 100,
  created_at      timestamptz   DEFAULT now(),

  CONSTRAINT devices_pkey PRIMARY KEY (id),
  CONSTRAINT devices_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);

-- ALERTS
CREATE TABLE public.alerts (
  id          bigint        GENERATED ALWAYS AS IDENTITY,
  device_id   uuid,
  severity    smallint      NOT NULL, -- 0=info 1=warning 2=critical
  cod         varchar(10)   NOT NULL, -- ex: "E001", "W002"
  message     varchar(255)  NOT NULL,
  resolved    boolean       DEFAULT false,
  created_at  timestamptz   DEFAULT now(),

  CONSTRAINT alerts_pkey PRIMARY KEY (id),
  CONSTRAINT alerts_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id)
);

-- TELEMETRY
CREATE TABLE public.telemetry_logs (
  id            bigint      GENERATED ALWAYS AS IDENTITY,
  device_id     uuid        NOT NULL,
  temperature   real        NOT NULL, -- 4 bytes, suficiente para °C
  pressure      real        NOT NULL, -- 4 bytes, suficiente para bar
  current       real,                 -- corrente elétrica (A)
  rpm           smallint,             -- RPM do eixo
  vibration     real,                 -- mm/s
  humidity      smallint,             -- % ambiente (0-100)
  created_at    timestamptz DEFAULT now(),

  CONSTRAINT telemetry_logs_pkey PRIMARY KEY (id),
  CONSTRAINT telemetry_logs_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id)
);

-- ÍNDICES para queries frequentes
CREATE INDEX idx_telemetry_device_id  ON public.telemetry_logs (device_id);
CREATE INDEX idx_telemetry_created_at ON public.telemetry_logs (created_at DESC);
CREATE INDEX idx_alerts_device_id     ON public.alerts (device_id);
CREATE INDEX idx_alerts_resolved      ON public.alerts (resolved) WHERE resolved = false;