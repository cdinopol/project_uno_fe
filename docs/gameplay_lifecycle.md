GAMEPLAY - LIFECYCLE
====================

1. USER opens APP
2. Splash Scene (handshake)
   1. APP check and get local credentials/token (localStorage)
      1. If credentials/token doesn’t exists
         1. Request credentials/token and store in localStorage
   2. Preload loading scene
3. Loading Scene
   1. REST player data (name, last campaign heroes used, current world-stage, ingame rss, etc)
   2. Store requested data on player.config
   3. Preload Campaign Scene
4. Campaign Scene
   1. Load stage based on current world-stage
   2. Load last used heroes
   3. Preload battle scene
   4. User clicks BATTLE
5. Battle Scene
   1. Load stage based on current world-stage
   2. Load enemies
   3. Load last used heroes
   4. User rearrange hero formation
   5. User click BEGIN BATTLE
      1. REST new formation
         1. Check if valid (anti hack)
            1. If not valid (error, back to 2)
         2. Store last campaign hero used
         3. Simulate battle
         4. Return battle data and last hero used data
      2. Load battle data and store last hero used to player.config
      3. Battling…
      4. Show result
         1. If lose
            1. Show LOSER splash
            2. Show Try Again button
            3. Click anywhere to continue
         2. If win
            1. REST winner validity and update current world-stage
            2. Update local world-stage
            3. Show WINNER splash
            4. Show Next stage button
            5. Click anywhere to continue