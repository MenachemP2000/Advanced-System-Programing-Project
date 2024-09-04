# Advanced Web Development Project part 2

# Running the Server

To run the server, follow these steps:

1. Open your terminal or command prompt.
2. navigate to the dirctory where the web development build is located (web-development-build).
3. Open the .env file and add the following line with your local IP:
   ```
   REACT_APP_API_BASE_URL = 'http://<your_local_IP>:4000
    ```

   
3. run the following command to install the required packages:
    ```
   npm install
    ```

4. Run the following command to build the production version of the web development files:
    ```
   npm run build
    ```

5. Navigate to the directory where the server files are located : /server.
6. navigate to the data directory: server/data.
7. run the script as instructed in the README.md file in the data directory.
8. return to server directory and run the following command to install the required packages:
    ```
   npm install
    ```
9. after that Run the following commands to start the servers:
    ```
   node server.js
    ```
10. The server should now be running and accessible. Check the terminal output for the address and port it is listening on, it should be `http://localhost:4000`.



