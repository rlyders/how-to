import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/rlyders/how-to.git', // Update to point to your repository
  user: {
   name: 'Richard Lyders', // update to use your name
   email: 'Richard@Lyders.com' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);