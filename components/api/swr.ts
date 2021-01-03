import { Draqula, useDraqulaClient, useQuery } from 'draqula';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Profiler, useEffect } from 'react';
import useSWR, { ConfigInterface, responseInterface } from 'swr';
import { useToken } from '../use-firebase';
import { isServer } from '../util';

import { ProfileInfo } from './types';

export function useSWRQuery<Mapped = any, Data = any, Error = any>(
  query: DocumentNode,
  variables: Record<string, any> = {},
  selector?: (x: Data) => Mapped,
  config?: ConfigInterface<Mapped, Error>
): responseInterface<Mapped, Error> {
  const client = useDraqulaClient();
  const token = useToken();

  const key = [client, query];

  if (selector) {
    return useSWR<Mapped, Error>(
      key,
      (c: Draqula) =>
        c
          .query<Data>(query, variables, { cache: false })
          .then((x) => selector(x)),
      config
    );
  } else {
    return useSWR<Mapped, Error>(
      key,
      (c: Draqula) => c.query<Mapped>(query, variables, { cache: false }),
      config
    );
  }
}

const LIST_USERS = gql`
  query ListUsers {
    profiles {
      uid
      display_name
    }
  }
`;

export function useListUsers() {
  return useSWRQuery<ProfileInfo[], { profiles: ProfileInfo[] }>(
    LIST_USERS,
    {},
    (x) => x.profiles
  );
}

/*
export function useListUsers() {
  return useQuery<any>(LIST_USERS, {}, {});
}

*/
