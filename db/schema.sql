CREATE TABLE IF NOT EXISTS docs (
  path    TEXT PRIMARY KEY,          -- teacher/c0, teacher/meta, student/<id>
  data    JSONB  NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS docs_updated ON docs(updated);
