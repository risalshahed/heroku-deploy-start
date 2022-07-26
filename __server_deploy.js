/* 
----------------------
One Time for each PC
----------------------
1. Create heroku account
2. Verify email
3. Install heroku CLI on windows i.e. OS
4. heroku login

------------------
My Note
------------------
existing app kivabe pabo? Go to https://dashboard.heroku.com/apps & then navigate "deploy tab", we'll get instruction
-------------------------------
For Each Project, One time
-------------------------------
1. heroku create
2. make sure you git add, git commit & git push
3. git push heroku main
4. Go to heroku dashboard > Current Project > Settings > Reveal Config vars
5. copy paste config vars from your .env file (user, pass, jwt secret etc.)
6. Make sure you whitelisted all IP address to access mongodb (Network access a giye ensure krbo, 0.0.0.0. ase kina i.e. server access deya ase ki na)
-------------------------------
1. Make changes
-------------------------------
*/