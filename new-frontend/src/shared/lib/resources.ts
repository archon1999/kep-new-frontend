export enum Resources {
  Contest = '/competitions/contests/contest/:id',
  ArenaTournament = '/competitions/arena/tournament/:id',
  Attempt = '/practice/problems/attempts/:id',
  Problem = '/practice/problems/problem/:id',
  Test = '/practice/tests/test/:id',
}

export function getResourceById(resource: Resources, id: number | string) {
  return resource.replace(':id', id.toString());
}
