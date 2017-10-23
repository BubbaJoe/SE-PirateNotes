/*
@author Joe Williams
Software Engineering : East Carolina University
PirateNotes
*/

# CAREFUL THIS WILL DELETE ALL THE DATA IN THE DATABASE
drop database piratenotes;
create database piratenotes;

use piratenotes;

create table department (
    id varchar(32) not null,
    dept_name varchar(256) not null,
    dept_abbr varchar(4) not null,
    primary key(id)
);
create table course (
    id varchar(32) not null,
    dept_id varchar(32),
    course_name varchar(256),
    course_num varchar(4),
    primary key(id),
    foreign key(dept_id) references department(id)
);

# id, username, email, password, firstname, 
# lastname, desc_text, acc_type, acc_status
create table user (
    id varchar(32) not null,
    email varchar(64) not null unique,
    password varchar(256) not null,
    firstname varchar(32) not null,
    lastname varchar(32) not null,
    desc_text text,
    profile mediumblob,
    acc_type enum('general','moderator','admin') not null,
    acc_status enum('active','suspended','banned') not null,
    primary key(id)

);

# id, user_id, course_id, post_text, post_status
create table post (
    id varchar(32) not null,
    user_id varchar(32) not null,
    course_id varchar(32) not null,
    post_text text not null,
    post_status enum('pending','denied','allowed') not null,
    primary key(id),
    foreign key(user_id) references user(id),
    foreign key(course_id) references course(id)
);

# id, post_id, file_name, file_size, 
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

# Optional tables: 
# likes(user_id,post_id) - a user likes a post
# comment(user_id,post_id,time,text) - a user comments on a post
# message(user_id,user_id,time,message) - a user messages another user
# reported_post(user_id,post_id,reason) - a user reports a post
# reported_user(user_id,user_id,reason) - a user reports a user