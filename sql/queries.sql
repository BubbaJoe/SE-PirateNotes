#select all post information and first name and last name using the user id.
#Search Query

# Department
select * from department
where dept_name like '%?%'
or dept_abbr like '%?%';

# Course
select * from course
where course_name like '%?%' or
dept_abbr like '%?%' or
course_num like '%?%';

# Post
select * from post
where post_text like '%?%';

# File
select * from post
where post_text like '%?%';