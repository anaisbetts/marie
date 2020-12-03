import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';
import * as pg from '@pulumi/postgresql';

const cfg = new pulumi.Config();
const network = new docker.Network('net');

const pgImg = new docker.RemoteImage('postgresql-image', {
  name: 'postgres:12',
  keepLocally: true,
});

const pgVol = new docker.Volume('pgdata');

export const pgContainer = new docker.Container('postgres', {
  image: pgImg.name,
  networksAdvanced: [{ name: network.name }],
  restart: 'on-failure',
  volumes: [
    { volumeName: pgVol.name, containerPath: '/var/lib/postgresql/data' },
  ],
  envs: [
    `POSTGRES_USER=${cfg.require('pguser')}`,
    cfg.requireSecret('pgpass').apply((p) => `POSTGRES_PASSWORD=${p}`),
  ],
  ports: [{ internal: 5432, external: 5432 }],
});

const pgProvider = new pg.Provider('pg', {
  host: pgContainer.ipAddress,
  username: cfg.require('pguser'),
  password: cfg.requireSecret('pgpass'),
  sslmode: 'disable',
});

export const db = new pg.Database('marie', {}, { provider: pgProvider });

const hasuraImage = new docker.RemoteImage('hasura-image', {
  name: 'hasura/graphql-engine:v1.3.2',
  keepLocally: true,
});

export const hasuraContainer = new docker.Container('hasura', {
  image: hasuraImage.name,
  networksAdvanced: [{ name: network.name }],
  restart: 'on-failure',
  envs: [
    cfg.requireSecret('pgpass').apply((p) => {
      const u = cfg.require('pguser');

      return pgContainer.name.apply((hn) =>
        db.name.apply(
          (name) =>
            `HASURA_GRAPHQL_DATABASE_URL=postgres://${u}:${p}@${hn}:5432/${name}`
        )
      );
    }),
    cfg
      .requireSecret('pgpass')
      .apply((p) => `HASURA_GRAPHQL_ADMIN_SECRET=${p}`),
    `HASURA_GRAPHQL_JWT_SECRET={"type":"RS512", "jwk_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"}`,
    `HASURA_GRAPHQL_ENABLE_CONSOLE=false`,
    `HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous`,
  ],
  ports: [{ internal: 8080, external: 8081 }],
});
