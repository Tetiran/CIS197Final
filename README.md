website at https://finalcis197.herokuapp.com
github at https://github.com/Tetiran/CIS197Final

This site is based on a heavily modified version the Campuswire light implementation from HW5.

This site hosts a space Asteroid avoidance game with a leaderboard on the main page. 
The main page and leaderboard scores are public but to play the game you need to create an account and login so the server can track your high score.
The game is written in PIXIjs and user data and high scores are stored in MongoDB. It uses express for authentication and routing.

HTML pages can be found under /views.
static content and the main page JSX are under /static.
All content related to the Asteroid game at /play is in the /Game folder
