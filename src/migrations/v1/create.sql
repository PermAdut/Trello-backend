BEGIN;


CREATE TABLE IF NOT EXISTS public."Users"
(
    id bigserial NOT NULL,
    email character varying(30) NOT NULL,
    username character varying(20) NOT NULL,
    "firstName" character varying(20) NOT NULL,
    "passwordHash" character varying NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT email UNIQUE (email),
    CONSTRAINT username UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS public."Logs"
(
    id bigserial NOT NULL,
    "userId" bigint NOT NULL,
    log text NOT NULL,
    "timestamp" time with time zone NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Tables"
(
    id bigserial NOT NULL,
    "userId" bigint NOT NULL,
    name text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Lists"
(
    id bigserial NOT NULL,
    "tableId" bigint NOT NULL,
    name text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Tasks"
(
    id bigserial NOT NULL,
    "listId" bigint NOT NULL,
    title text NOT NULL,
    description text,
    "isCompleted" boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public."Logs"
    ADD FOREIGN KEY ("userId")
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Tables"
    ADD FOREIGN KEY ("userId")
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Lists"
    ADD FOREIGN KEY ("tableId")
    REFERENCES public."Tables" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Tasks"
    ADD FOREIGN KEY ("listId")
    REFERENCES public."Lists" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;