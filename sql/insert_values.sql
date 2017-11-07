#https://www.guidgenerator.com/online-guid-generator.aspx
#use the link above to generate uuid/guid

#insert into user (id,email,password,firstname,lastname,acc_type,acc_status)
#    values('id','email','password','firstname','lastname','acc_type','acc_status');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('2d29c09cb9be4293ac690b75531e1489', '' , 'Naruto', 'Uzimaki', 'general', 'active');

insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('f3e0023dea584c07ac7e78e9dc6a4729', '' , 'Itachi', 'Uchiha', 'moderator', 'active');

insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('5eca01a62b8f4753a579dbbbbfb79c12', '' , 'Shareef', 'Ozair', 'admin', 'active');
#insert into department (id,dept_name,dept_abbr) 
#   values('id','dept_name','dept_abbr');
insert into department (id, dept_name, dept_abbr)
values ('6dae5f4c4bbe49f4ba4fd5312d61020a', 'Computer Science', 'CSCI');

insert into department (id, dept_name, dept_abbr)
values ('26ad98fd69524a9e98a2c1a17297b252', 'Information Computer Technology', 'ICTN');

insert into department (id, dept_name, dept_abbr)
values ('7d4dd624d51647beb5b9023573f0d0fe', 'Management Information Systems', 'MIS');
#insert into course (id,dept_abbr,course_name,course_num) 
#   values('id','dept_abbr','course_name','course_num');
insert into course (id, dept_abbr, course_name, course_num)
values ('42ae3034b4284f87af2539597aa4d614', 'CSCI', 'Database Management System', '3700');

insert into course (id, dept_abbr, course_name, course_num)
values ('33897a56bee3475bbef1682325327149', 'ICTN', 'Digital Communications', '2154');

insert into course (id, dept_abbr, course_name, course_num)
values ('e11227b2f84d4175a16abbc2cf2ee3df', 'MIS', '', '');
#insert into post (id,user_id,course_id,post_text,posdt_status) 
#   values('id','user_id','course_id','post_text','post_status');
