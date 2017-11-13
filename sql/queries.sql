#Name: queries.sql
#Author: Dakota
#This file contains many of the queries that are used on the databse.

#select all post information and first name and last name using the user id.
#Posts for the courses that the user is following

select post.*
from followed inner join post
on followed.course_id = post.course_id
where followed.user_id = ?;

#get all pending posts
select *
from post
where post_status = 'pending';

#get all posts
select *
from post;

#accept a pending post
update post
set post_status = 'allowed'
where post.id = '?';

#decline a pending post
update post
set post_status = 'denied'
where post.id = '?';

#suspend a user's account
update user
set acc_status = 'suspended'
where user.id = '?';

#ban a user's account
update user
set acc_status = 'banned'
where user.id = '?';
