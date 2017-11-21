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
    gender enum('male','female'),
    major varchar(256),
    interests text,
    profile_image mediumblob,
    profile_desc text,
    acc_type enum('general','mod','admin') not null,
    acc_status enum('active','warning','banned','unverified') not null,
    primary key(id)
);

# notification
create table notification (
    id varchar(32) not null,
    user_id varchar(32) not null,
    n_time varchar(32),
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
    post_date varchar(32),
    post_status enum('pending','denied','allowed') not null,
    primary key(id),
    foreign key(user_id) references user(id),
    foreign key(course_id) references course(id)
);

# file
create table file (
    id varchar(32) not null,
    post_id varchar(32) not null,
    file_name varchar(256) not null,
    file_size int,
    file_type varchar(256),
    file_data mediumblob,
    primary key(id),
    foreign key(post_id) references post(id)
);

# likes
create table liked (
    user_id varchar(32) not null,
    post_id varchar(32) not null,
    primary key(user_id, post_id),
    foreign key (user_id) references user(id),
    foreign key (post_id) references post(id)
);

# saved
create table saved (
    user_id varchar(32) not null,
    post_id varchar(32) not null,
    primary key(user_id, post_id),
    foreign key (user_id) references user(id),
    foreign key (post_id) references post(id)
);

# followed
create table followed_course (
    user_id varchar(32) not null,
    course_id varchar(32) not null,
    primary key(user_id, course_id),
    foreign key (user_id) references user(id),
    foreign key (course_id) references course(id)
);

# followed
create table followed_department (
    user_id varchar(32) not null,
    dept_id varchar(32) not null,
    primary key(user_id, dept_id),
    foreign key (user_id) references user(id),
    foreign key (dept_id) references department(id)
);

# reported_post
create table reported_post (
    user_id varchar(32) not null,
    post_id varchar(32) not null,
    reason text not null,
    primary key(user_id, post_id),
    foreign key (user_id) references user(id),
    foreign key (post_id) references post(id)
);

# reported_user
create table reported_user (
    user_id_1 varchar(32) not null,
    user_id_2 varchar(32) not null,
    reason text not null,
    primary key(user_id_1, user_id_2),
    foreign key (user_id_1) references user(id),
    foreign key (user_id_2) references user(id)
);

# reported_bug
create table reported_bug (
    user_id varchar(32) not null,
    reason text not null,
    primary key(user_id),
    foreign key (user_id) references user(id)
);
