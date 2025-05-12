to strt running the project
<br>
---> open ubuntu and type--->"sudo service redis-server start"
<br>
---> then write "redis-cli ping" and you get a "pong"
<br>
--->write nodemon on vs code terminal 
<br>
--->no error means connection establishrh
<br>
---> go to post man and write "http://localhost:7005/ping" and click send
<br>
--->{
    "success": false,
    "message": "Missing user_id header"
} if it is showing false go to headers in postman and add "user_id" key and its value e.g-123456.
<br>
---> it should show {
    "success": true,
    "message": "pong"
}

--->
