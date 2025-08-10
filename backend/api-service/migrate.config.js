module.exports = {
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
  migrationsTable: "pgmigrations",
  dir: "migrations",
  direction: "up",
  count: Infinity,
  createSchema: true,
  schemaTable: "pgmigrations",
};
