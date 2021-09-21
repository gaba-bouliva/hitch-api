var dbConfig = {
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'postgres',
      database: 'hitch',
      username: 'postgres',
      password: 'postgres',
      port: 5432,
      entities: ['**/*.entity.js'],
      synchronize: true,
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'postgres',
      database: 'hitch-test-db',
      entities: ['**/*.entity.ts'],
      username: 'postgres',
      password: 'postgres',
      port: 5432,
      synchronize: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      database: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });

  default:
    throw new Error('Unknown Environment...(development | production | test)');
}

module.exports = dbConfig;
