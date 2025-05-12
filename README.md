to strt running the project
---> open ubuntu and type--->"sudo service redis-server start"
---> then write "redis-cli ping" and you get a "pong"
--->write nodemon on vs code terminal 
--->no error means connection establishrh
---> go to post man and write "http://localhost:7005/ping" and click send
--->{
    "success": false,
    "message": "Missing user_id header"
} if it is showing false go to headers in postman and add "user_id" key and its value e.g-123456.

---> it should show {
    "success": true,
    "message": "pong"
}

--->
