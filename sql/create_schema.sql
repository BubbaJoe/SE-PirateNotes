/*
    @author Joe Williams
    Software Engineering : East Carolina University
    PirateNotes
*/

# CAREFUL THIS WILL DELETE ALL THE DATA IN THE DATABASE
drop database piratenotes;
create database piratenotes;

use piratenotes;

# user
create table user (
    id varchar(32) not null,
    email varchar(64) not null unique,
    password varchar(256) not null,
    firstname varchar(64) not null,
    lastname varchar(64) not null,
    profile_image mediumblob default 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDMxOS4zMzUgMzE5LjMzNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzE5LjMzNSAzMTkuMzM1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0VBRUFFMTsiIGQ9Ik0zMDMuODU4LDI1My44ODdjLTExLjE1MS0zNy43NTQtNjcuMTIxLTMzLjU2Ni05MS4yNzktNDQuNDA4DQoJCQljLTI0LjE1Ny0xMC44NDItMjAuMzg2LTQ3LjIxOS0yMy40NDktNTMuNTQ4aC01OC45MzJjLTMuMDU4LDYuMzI5LDAuNzE0LDQyLjcxMS0yMy40NDksNTMuNTQ4DQoJCQljLTI0LjE1NywxMC44NDItODAuMTMzLDYuNjU1LTkxLjI3OSw0NC40MDhjLTYuMTQ5LDIwLjgyNC01Ljg1NywyNy4xOTMtNy41NTQsNTAuMjZjMCwwLDc2LjgsMTUuMTg3LDE1MC4wMTQsMTUuMTg3DQoJCQlzMTUzLjQ4OC0xNS4xODcsMTUzLjQ4OC0xNS4xODdDMzA5LjcxNSwyODEuMDc0LDMxMC4wMDcsMjc0LjcxMiwzMDMuODU4LDI1My44ODd6Ii8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOiNFMERCRDM7IiBkPSJNMzAzLjg1OCwyNTMuODg3Yy0xMS4xNTEtMzcuNzU0LTY3LjEyMS0zMy41NjYtOTEuMjc5LTQ0LjQwOA0KCQkJYy0yNC4xNTctMTAuODQyLTIwLjM4Ni00Ny4yMTktMjMuNDQ5LTUzLjU0OGgtMzEuMjA2YzAsMC0wLjcxOSw1MS4wMjQsMjMuNDM4LDYxLjg2NnM4MC4xMzMsNi42NTUsOTEuMjc5LDQ0LjQwOA0KCQkJYzUuODU3LDE5LjgzLDUuODY4LDI2LjU1Miw3LjMyNCw0Ny4wNzNjMTkuMjM0LTIuODE2LDMxLjQ0Mi01LjEyNiwzMS40NDItNS4xMjZDMzA5LjcxNSwyODEuMDc0LDMxMC4wMDcsMjc0LjcxMiwzMDMuODU4LDI1My44ODcNCgkJCXoiLz4NCgkJPGc+DQoJCQk8cG9seWdvbiBzdHlsZT0iZmlsbDojQzZDNUFGOyIgcG9pbnRzPSIyMDkuMzgxLDIwNy43OTggMTc2LjI5MywyMzYuNDkyIDE3MS4zMDcsMjA1Ljg4NyAJCQkiLz4NCgkJCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNDNkM1QUY7IiBwb2ludHM9IjEwOS40MTksMjA4LjExMyAxNDMuMDAyLDIzNi40OTIgMTQ2Ljk4MSwyMDUuODg3IAkJCSIvPg0KCQkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0M2QzVBRjsiIHBvaW50cz0iMTcyLjE5LDIwNS44ODcgMTQ2Ljk4MSwyMDUuODg3IDE0NS4wNywyMTIuMDcgMTc0LjE0NiwyMTIuMjM5IAkJCSIvPg0KCQkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0FBQTg4RjsiIHBvaW50cz0iMTQ2Ljk4MSwyMDUuODg3IDE0NS4wNywyMTIuMDcgMTQ2LjE3MiwyMTIuNzg5IAkJCSIvPg0KCQkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0FBQTg4RjsiIHBvaW50cz0iMTc0LjE0NiwyMTIuMjM5IDE3MS4zNzUsMjA2LjExMiAxNzIuNDk5LDIxMy4xOTQgCQkJIi8+DQoJCQk8cGF0aCBzdHlsZT0iZmlsbDojNEM0QzRDOyIgZD0iTTE3My42MTcsMzE5LjEwOWwwLjU3OS03Ljk4N2wtNi4wODItODAuNTFIMTUyLjA5bC03LjA5OSw4MC41MTVsMC41ODUsOC4wNjYNCgkJCQljNC4xMiwwLjA4NCw4LjI0LDAuMTQxLDEyLjM1NCwwLjE0MUMxNjMuMTM1LDMxOS4zMzUsMTY4LjM3MywzMTkuMjQ5LDE3My42MTcsMzE5LjEwOXoiLz4NCgkJCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiMzQTNBMzg7IiBwb2ludHM9IjE1Mi4xNTIsMjMwLjk2NiAxNjguMTE1LDIzMC42MDcgMTY4LjQ0MSwyMzUuMTAzIAkJCSIvPg0KCQkJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzRDNEM0QzsiIHBvaW50cz0iMTQwLjcyNSwyMDguNTUxIDE3OC40NCwyMDguNTI5IDE3Ni4yOTMsMjIxLjQgMTY3Ljc3NywyMzAuOTY2IDE1Mi4xNTIsMjMwLjk2NiANCgkJCQkxNDIuODc4LDIyMS40IAkJCSIvPg0KCQkJPHBhdGggc3R5bGU9ImZpbGw6I0VBRUFFMTsiIGQ9Ik0xNDYuOTgxLDIwNS44ODdsLTI1LjcyLTEzLjk4NGMwLDAtMy4zODksNC44MTctMTEuODQzLDE2LjIxbDMxLjcyMywyMi44NTNsMi43MDQtMTQuOTIzDQoJCQkJTDE0Ni45ODEsMjA1Ljg4N3oiLz4NCgkJCTxwYXRoIHN0eWxlPSJmaWxsOiNFQUVBRTE7IiBkPSJNMTcxLjMwNywyMDUuODg3bDI1LjcyLTEzLjk4NGMwLDAsMy45MDEsNC41MDIsMTIuMzU0LDE1Ljg5NWwtMzIuMjM0LDIzLjE2OGwtMi43MDQtMTQuOTIzDQoJCQkJTDE3MS4zMDcsMjA1Ljg4N3oiLz4NCgkJCTxwYXRoIHN0eWxlPSJmaWxsOiNFMERCRDM7IiBkPSJNMTk3LjAyNywxOTEuOTAzbC0yNS43MiwxMy45ODRsMS43NzYsNS43NzJjMi4zNzIsMi42MDIsNS4xMDksNC43MTYsOC4yNzksNi4xMzgNCgkJCQljMi44MDUsMS4yNTksNi4wMzcsMi4zMTYsOS41NzgsMy4yNTRsMTguNDM2LTEzLjI0OEMyMDAuOTI4LDE5Ni40MDUsMTk3LjAyNywxOTEuOTAzLDE5Ny4wMjcsMTkxLjkwM3oiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCQ0KCQkJCTxlbGxpcHNlIHRyYW5zZm9ybT0ibWF0cml4KC0wLjE3NyAwLjk4NDIgLTAuOTg0MiAtMC4xNzcgMzg2LjIzNzkgLTg1LjExODQpIiBzdHlsZT0iZmlsbDojQ0NBNDgzOyIgY3g9IjIyOC43MDciIGN5PSIxMTguOTI3IiByeD0iMjEuMzg2IiByeT0iMTEuNjI5Ii8+DQoJCQkNCgkJCQk8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgtMC45ODQyIDAuMTc3IC0wLjE3NyAtMC45ODQyIDIwMC41MjI4IDIxOS45ODE1KSIgc3R5bGU9ImZpbGw6I0RCQjQ5MTsiIGN4PSI5MC40NSIgY3k9IjExOC45MzUiIHJ4PSIxMS42MjkiIHJ5PSIyMS4zODYiLz4NCgkJCTxwYXRoIHN0eWxlPSJmaWxsOiNEQkI0OTE7IiBkPSJNMjIzLjgyNiw0Ny43MzRoLTY0LjIyMUg5NS40MThjMCwwLTM1Ljk4OSwxNDYuNjE0LDY0LjE4NywxNjAuODA2DQoJCQkJQzI1OS44MjEsMTk0LjM0OCwyMjMuODI2LDQ3LjczNCwyMjMuODI2LDQ3LjczNHoiLz4NCgkJCTxwYXRoIHN0eWxlPSJmaWxsOiNDQ0E0ODM7IiBkPSJNMTU5LjYwNSwyMDguNTRjMTAwLjIxNi0xNC4xOTIsNjQuMjIxLTE2MC44MDYsNjQuMjIxLTE2MC44MDZoLTE1LjAyNA0KCQkJCWM0LjExNCw2MS4yNDIsOS44MDgsOTMuNzc0LTEzLjgxNSwxMjkuMjRDMTc2LjI3LDIwNS4wNzgsMTU5LjYwNSwyMDguNTQsMTU5LjYwNSwyMDguNTR6Ii8+DQoJCQk8cGF0aCBzdHlsZT0iZmlsbDojQ0NBNDgzOyIgZD0iTTE5Mi44NTEsNTUuNjAzTDkwLjQ5NCw4My43MzRjOC42NjEsMy40NjgsMjUuNTc0LDkuODY0LDYxLjc0OCw5LjcwNw0KCQkJCWMyMC4xMzMtMC4wOSw2NC40MTItNi4yMzksNzQuMjAzLTI5Ljc5NUwxOTIuODUxLDU1LjYwM3oiLz4NCgkJCTxwYXRoIHN0eWxlPSJmaWxsOiM1MTUxNTE7IiBkPSJNMjIzLjQ3OCwzNC4wMzFjMCwwLTcuNjMzLTI3LjMyMi01OC4wMjctMzMuNDA5Yy00MC4yNDQtNC44NjItNzIuNDUsMjAuNTMyLTExOC4yMjQsMTQuODENCgkJCQljLTAuMjE5LDI1LjM3Nyw2LjIyMiw1NC4zNTEsMzEuNDE5LDY1LjMyOGMtMC4yNDcsMTAuNzkyLDAuNDc4LDI0Ljg2NiwxMC44NTksMzYuMjY0YzAsMC0wLjkxNi0xOC41NDgsMC45NTYtMzMuMzEzDQoJCQkJYzAsMCwyMi44MzcsNS41OTMsNDkuMDQsNS42NDljMjcuODU2LDAuMDU2LDY0Ljk5Ny00LjUxOSw4Ni45NTEtMjUuNzJjMCwwLDMuMjk0LDIwLjE2NywzLjI5NCw1My4zODUNCgkJCQljMCwwLDcuNTA5LTcuOTMxLDguNzY4LTIwLjAyNkMyNDEuMzYzLDY5LjU2NSwyNDQuMDI3LDMyLjc3MiwyMjMuNDc4LDM0LjAzMXoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K',
    profile_desc text,
    acc_type enum('general','moderator','admin') not null,
    acc_status enum('active','suspended','banned') not null,
    primary key(id)
);

# notification(user_id,time,message,checked) - a gets a notification
create table notification (
    id varchar(32) not null,
    user_id varchar(32) not null,
    n_time datetime,
    message text not null,
    checked boolean,
    primary key(id),
    foreign key (user_id) references user(id)
);

# department
create table department (
    id varchar(32) not null,
    dept_name varchar(256) not null unique,
    dept_abbr varchar(4) not null,
    primary key(id)
);

# course
create table course (
    id varchar(32) not null,
    dept_abbr varchar(4),
    course_name varchar(256),
    course_num varchar(4),
    primary key(id),
    foreign key(dept_abbr) references department(dept_abbr)
);

# post
create table post (
    id varchar(32) not null,
    user_id varchar(32) not null,
    course_id varchar(32) not null,
    post_text text not null,
    post_date datetime,
    post_status enum('pending','denied','allowed') not null,
    primary key(id),
    foreign key(user_id) references user(id),
    foreign key(course_id) references course(id)
);

# file
create table file (
    id varchar(32) not null,
    post_id varchar(32),
    file_name varchar(256),
    file_size int,
    file_type varchar(4),
    file_data mediumblob,
    primary key(id),
    foreign key(post_id) references post(id)
);

# likes(user_id,post_id) - a user likes a post
create table liked (
    user_id varchar(32) not null,
    post_id varchar(32) not null,
    primary key(user_id, post_id),
    foreign key (user_id) references user(id),
    foreign key (post_id) references post(id)
);

# saved(user_id,post_id) - a user saved a post
create table saved (
    user_id varchar(32) not null,
    post_id varchar(32) not null,
    primary key(user_id, post_id),
    foreign key (user_id) references user(id),
    foreign key (post_id) references post(id)
);

# followed(user_id,course_id) - a user is following a course
create table followed (
    user_id varchar(32) not null,
    course_id varchar(32) not null,
    primary key(user_id, course_id),
    foreign key (user_id) references user(id),
    foreign key (course_id) references course(id)
);

# reported_post(user_id,post_id,reason) - a user reports a post
create table reported_post (
    user_id varchar(32) not null,
    post_id varchar(32) not null,
    reason text not null,
    primary key(user_id, post_id),
    foreign key (user_id) references user(id),
    foreign key (post_id) references post(id)
);

# reported_user(user_id,user_id,reason) - a user reports a user
create table reported_user (
    user_id_1 varchar(32) not null,
    user_id_2 varchar(32) not null,
    reason text not null,
    primary key(user_id_1, user_id_2),
    foreign key (user_id_1) references user(id),
    foreign key (user_id_2) references user(id)
);

# sessions (auto-generated table for user sessions)
# session_id varchar(128) not null
# expires int(11) not null 
# data text