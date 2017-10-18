/*
@author Joe Williams
Software Engineering : East Carolina University
PirateNotes
*/

#drop table user;
#drop table post;
#drop table course;
#drop table department;


# CREATE SCHEMA

# id, username, email, password, firstname, 
# lastname, desc_text, acc_type, acc_status
create table user (
    id int not null auto_increment,
    username varchar(16) not null,
    email varchar(32) not null,
    password varchar(32) not null,
    firstname varchar(32) not null,
    lastname varchar(32) not null,
    desc_text text not null,
    acc_type enum('general','moderator','admin') not null,
    acc_status enum('active','suspended','banned') not null,
    primary key(id)
);

# id, user_id, course_id, post_text, post_status
create table post (
    id int not null auto_increment,
    user_id int not null,
    course_id int not null,
    post_text text not null,
    post_status enum('pending','denied','allowed') not null,
    primary key(id),
    foreign key(user_id) references user(id),
    foreign key(course_id) references course(id)
);

# id, post_id, file_name, file_size, 
create table file (
    id int not null auto_increment,
    post_id int,
    file_name varchar(32),
    file_size int,
    file_type varchar(4),
    file_data mediumblob,
    primary key(id),
    foreign key(post_id) references post(id)
);

create table department (
    id int not null auto_increment,
    dept_name int(256) not null,
    dept_abbr varchar(4) not null,
    primary key(id)
);

create table course (
    id int not null auto_increment,
    dept_id int,
    course_name varchar(256),
    course_num varchar(4),
    primary key(id),
    foreign key(dept_id) references department(id)
);

# Optional tables: 
# likes(user_id,post_id) - a user likes a post
# comment(user_id,post_id,time,text) - a user comments on a post
# message(user_id,user_id,time,message) - a user messages another user
# reported_post(user_id,post_id,reason) - a user reports a post
# reported_user(user_id,user_id,reason) - a user reports a user