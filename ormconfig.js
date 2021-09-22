var PostgressConnectionStringParser = require('pg-connection-string').parse;

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
    var herokuDbConnectionOptions = PostgressConnectionStringParser.parse(
      process.env.DATABASE_URL,
    );
    console.log('DB Conn Object', herokuDbConnectionOptions);
    Object.assign(dbConfig, {
      type: 'postgres',
      name: herokuDbConnectionOptions.name,
      host: herokuDbConnectionOptions.host,
      port: herokuDbConnectionOptions.port,
      username: herokuDbConnectionOptions.username,
      password: herokuDbConnectionOptions.password,
      database: herokuDbConnectionOptions.database,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });

  default:
    throw new Error(`Unknown Environment ${process.env.NODE_ENV}`);
}

module.exports = dbConfig;
