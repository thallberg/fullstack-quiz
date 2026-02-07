import * as auth from './auth';
import * as quiz from './quiz';
import * as friendships from './friendships';
import * as leaderboard from './leaderboard';

export const fetchClient = {
  ...auth,
  ...quiz,
  ...friendships,
  ...leaderboard,
};

export { auth, quiz, friendships, leaderboard };
