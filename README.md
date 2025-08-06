## Description
This app is an intercative board like miro and others. 

I used Framer Motion library to add all drag and resize functionality for elements on this board.

It was created for my learning and practicing purposes. I was learning how to build a project using React. How to use available libraries, integrate an api, how to implement basic React tools and concepts with TypeScript.

To create this project I was using Vite, TypeScript, SCSS, Framer Motion, OpaenAI API, Context API.

This web app helps users to generate and orginize ideas for their art projects. 

## App demo
https://art-board-app-2e5v.vercel.app/art-board-app/board/0d1ca724
The mobile version is not supported yet.

## App usage demonstration
From sidebar tool list user can open ideas form, where it can generate ideas about chosen topics. Then thos ideas can be put on board in form of a note.

![image](https://github.com/user-attachments/assets/db8669a6-0bb1-49d2-823c-aec2316278da)

From the same siderbar user can add more notes and reference images for generated ideas and arrange them on board for planing.

![image](https://github.com/user-attachments/assets/ab3130c0-6efa-4348-8d67-4755ca700317)
![image](https://github.com/user-attachments/assets/6db520b9-4a72-49b9-99c6-a349916e104c)

All placable elements on this board are dragable and resizible

After work with the board is done, user can save them on their pc or it will be saved in browser. Saved file on pc will be in json format, it can be imported later if file has same data structure.

![image](https://github.com/user-attachments/assets/ed69ccb8-07c9-4ea4-ab3d-47283c24eff9)

Later on, server side storage was added. Board can now be stored in a remote DB and accesed via a link. User can save a board link on the side panel or just copy it and store it wherever they see fit. User can save board progress by pressing ctrl+s or closing page and progress may be saved automatically.

link example: https://art-board-app-2e5v.vercel.app/art-board-app/board/dd18ad68
<img width="351" height="456" alt="image" src="https://github.com/user-attachments/assets/87712bb1-c090-456a-9f97-d945c6694619" />


So the basic idea of this web app usage for person who is drawing something is:
1. Generate ideas about themes you want for inspiration
2. Put that idea on board, then search it on Pinterest for image references.
3. Organize references and ideas for your artwork on board, and then you have enough inspiration for starting to draw something.

## Installation
After git clone
1. npm install
2. npm run dev
## Backend repositories for this project

https://github.com/ArtursBaskovs/art-board-db-api - rest API for MySQL database.

https://github.com/ArtursBaskovs/art-board-app-backend/blob/main/openai.js - handles requests to openai API for idea generation tool.

## env. file template
VITE_API_BASE_URL=*************
VITE_DB_API_BASE_URL=*************
VITE_DB_API_KEY=***********



