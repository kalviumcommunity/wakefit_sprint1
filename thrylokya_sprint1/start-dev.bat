@echo off
echo ========================================================
echo Starting Wakefit Return Scheduling App (Local Node.js)
echo ========================================================
call npm install
call npx prisma db push
call npm run seed
call npm run dev
pause
