CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS account (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account     VARCHAR
);

CREATE TABLE IF not EXISTS posts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url             VARCHAR NOT NULL UNIQUE,
    account_id      UUID NOT NULL,
    views           BIGINT,
    Likes           BIGINT,
    Saved           BIGINT,
    caption         VARCHAR,
    posted          TIMESTAMP,
    created         TIMESTAMP NOT NULL,
    updated         TIMESTAMP NOT NULL,
    deleted         TIMESTAMP,
    CONSTRAINT fk_account_id FOREIGN KEY(account_id) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS hashtags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR,
    post_id     UUID NOT NULL,
    created     TIMESTAMP NOT NULL,
    updated     TIMESTAMP NOT NULL,
    deleted     TIMESTAMP,
    CONSTRAINT fk_post_id FOREIGN KEY(post_id) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id  UUID NOT NULL,
    post_id     UUID NOT NULL,
    created     TIMESTAMP NOT NULL,
    updated     TIMESTAMP NOT NULL,
    deleted     TIMESTAMP,
    CONSTRAINT fk_account_id FOREIGN KEY(account_id) REFERENCES account(id),
    CONSTRAINT fk_post_id FOREIGN KEY(post_id) REFERENCES posts(id)
);
