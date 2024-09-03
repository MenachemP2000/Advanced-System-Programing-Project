# Advanced Web Development Project part 4

# Running the Server

To run the server, follow these steps:

1. Open your terminal or command prompt.
2. navigate to the dirctory where the web development build is located (web-development-build).
3. Open the .env file and add the following line with your local IP:

    ```
   REACT_APP_API_BASE_URL = 'http://<your_local_IP>:4000
    ```
   
5. run the following command to install the required packages:
    ```
   npm install
    ```

6. Run the following command to build the production version of the web development files:
    ```
   npm run build
    ```

7. Navigate to the directory where the server files are located : /server.
8. navigate to the data directory: server/data.
9. run the script as instructed in the README.md file in the data directory.
10. return to server directory and run the following command to install the required packages:
    ```
   npm install
    ```
11. after that Run the following commands to start the servers:
    ```
   ./cpp_server
   node server.js
    ```
11. The server should now be running and accessible. Check the terminal output for the address and port it is listening on, it should be `http://localhost:4000`.

12. For the Android part you can open the project through IDE and run it on the emulator.
    If you want to run it on your personal device you will need to change line 16 and 17 on res/values/strings.xml
    to
    ```
    <string name="BaseURL">http://<yourIP>:4000/api/</string>
    <string name="Base_Url">http://<yourIP>:4000/</string>
    ```
    Notice that you have to connect at your phone to the same Wifi as your PC connected to.
