#https://www.guidgenerator.com/online-guid-generator.aspx
#use the link above to generate uuid/guid
#HASH $2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy = 123

#insert into user (id,email,password,firstname,lastname,acc_type,acc_status)
#values('id','email','password','firstname','lastname','acc_type','acc_status');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('2d29c09cb9be4293ac690b75531e1489', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Naruto', 'Uzimaki', 'general', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('f3e0023dea584c07ac7e78e9dc6a4729', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Itachi', 'Uchiha', 'general', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('5eca01a62b8f4753a579dbbbbfb79c12', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Ozair', 'Shareef', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('40bcee06412f47908691e7fe52102199', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Joe', 'Williams', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('60e2da55449f4d8fa513614c72b48d80', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Will', 'Brimson', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('1346ad8844b94a4a8ae76f01beabea10', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Dakota', 'Long', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('e3c4b01ab9054d5bb2a601c3f4b5bf6c', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Evan', 'Loffink', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('2a771e780a56426ca9dd1f8f1f7c0bed', 'name@students.ecu.edu' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Sam', 'Twaiti', 'moderator', 'active');
#insert into department (id,dept_name,dept_abbr) 
#   values('id','dept_name','dept_abbr');
insert into department (id, dept_name, dept_abbr)
values ('6dae5f4c4bbe49f4ba4fd5312d61020a', 'Computer Science', 'CSCI');
insert into department (id, dept_name, dept_abbr)
values ('26ad98fd69524a9e98a2c1a17297b252', 'Information Computer Technology', 'ICTN');
insert into department (id, dept_name, dept_abbr)
values ('7d4dd624d51647beb5b9023573f0d0fe', 'Management Information Systems', 'MIS');
insert into department (id, dept_name, dept_abbr)
values ('45457b5021de4c878019514e70ef21bc', 'Electrical Engineering', 'EENG');
insert into department (id, dept_name, dept_abbr)
values ('95b6c1d19aaf4219a83b417965ccf7d3', 'Industrial Technology', 'ITEC');
insert into department (id, dept_name, dept_abbr)
values ('796d2c23347449fa96e8e77a7d4e11d3', 'Biomedical Engineering', 'BIME');
insert into department (id, dept_name, dept_abbr)
values ('c257fde67a054311b27c41bc62fb8631', 'Accounting', 'ACCT');
insert into department (id, dept_name, dept_abbr)
values ('15ee1766630d406aaa42e4c4141e4bd4', 'Art', 'ART');
insert into department (id, dept_name, dept_abbr)
values ('38aa91ffe86846209bb260344b244e7f', 'Education', 'EDUC');
insert into department (id, dept_name, dept_abbr)
values ('35825d4a44e24dc091985dcf4838307c', 'Criminal Justice', 'JUST');

# Courses
insert into course (id, dept_abbr, course_name, course_num)
values ('42ae3034b4284f87af2539597aa4d614', 'CSCI', 'Database Management System', '3700');
insert into course (id, dept_abbr, course_name, course_num)
values ('9c68020d80e04ce09acbd422efbdfc36', 'CSCI', 'Software Engineering I', '3030');
insert into course (id, dept_abbr, course_name, course_num)
values ('33897a56bee3475bbef1682325327149', 'ICTN', 'Digital Communication Systems', '2154');
insert into course (id, dept_abbr, course_name, course_num)
values ('60abb69007e147cf8e0cba70da2d843f', 'ICTN', 'Network Environment I', '2510');
insert into course (id, dept_abbr, course_name, course_num)
values ('e11227b2f84d4175a16abbc2cf2ee3df', 'MIS', 'Intro Management Info Systems', '3063');
insert into course (id, dept_abbr, course_name, course_num)
values ('213505cf4c054ebea7eec9cf8baccf7d', 'MIS', 'Software Design and Developement', '3673');
insert into course (id, dept_abbr, course_name, course_num)
values ('4b130312720747d9996f3122f0d7ea56', 'EENG', 'Signals and Systems', '3023');
insert into course (id, dept_abbr, course_name, course_num)
values ('d4769cfaf754427281a67ff1ffa90329', 'EENG', 'Digital Electronics', '2410');
insert into course (id, dept_abbr, course_name, course_num)
values ('22133f551c6d4d8cbd503ac1b84850bf', 'ITEC', 'Thermal and Fluid Systems', '2081');
insert into course (id, dept_abbr, course_name, course_num)
values ('0af00077634541d9a325a5d753252724', 'ITEC', 'Electromechanical Systems', '2090');
insert into course (id, dept_abbr, course_name, course_num)
values ('c980c0d7d0824b7a8ca8b1a57eb52dfd', 'BIME', 'Biomechanics and Materials', '4030');

# Followed Courses
insert into followed_course (user_id, course_id)
values ('40bcee06412f47908691e7fe52102199', '42ae3034b4284f87af2539597aa4d614');
insert into followed_course (user_id, course_id)
values ('40bcee06412f47908691e7fe52102199', '33897a56bee3475bbef1682325327149');
insert into followed_course (user_id, course_id)
values ('40bcee06412f47908691e7fe52102199', 'e11227b2f84d4175a16abbc2cf2ee3df');
insert into followed_course (user_id, course_id)
values ('40bcee06412f47908691e7fe52102199', '4b130312720747d9996f3122f0d7ea56');

insert into followed_course (user_id, course_id)
values ('2d29c09cb9be4293ac690b75531e1489', '42ae3034b4284f87af2539597aa4d614');
insert into followed_course (user_id, course_id)
values ('2d29c09cb9be4293ac690b75531e1489', '33897a56bee3475bbef1682325327149');
insert into followed_course (user_id, course_id)
values ('2d29c09cb9be4293ac690b75531e1489', 'e11227b2f84d4175a16abbc2cf2ee3df');
insert into followed_course (user_id, course_id)
values ('2d29c09cb9be4293ac690b75531e1489', '4b130312720747d9996f3122f0d7ea56');

# Followed Departments
insert into followed_department (user_id, dept_id)
values ('40bcee06412f47908691e7fe52102199', '6dae5f4c4bbe49f4ba4fd5312d61020a');
insert into followed_department (user_id, dept_id)
values ('40bcee06412f47908691e7fe52102199', '26ad98fd69524a9e98a2c1a17297b252');
insert into followed_department (user_id, dept_id)
values ('40bcee06412f47908691e7fe52102199', '7d4dd624d51647beb5b9023573f0d0fe');
insert into followed_department (user_id, dept_id)
values ('40bcee06412f47908691e7fe52102199', '45457b5021de4c878019514e70ef21bc');

insert into followed_department (user_id, dept_id)
values ('2d29c09cb9be4293ac690b75531e1489', '6dae5f4c4bbe49f4ba4fd5312d61020a');
insert into followed_department (user_id, dept_id)
values ('2d29c09cb9be4293ac690b75531e1489', '26ad98fd69524a9e98a2c1a17297b252');
insert into followed_department (user_id, dept_id)
values ('2d29c09cb9be4293ac690b75531e1489', '7d4dd624d51647beb5b9023573f0d0fe');
insert into followed_department (user_id, dept_id)
values ('2d29c09cb9be4293ac690b75531e1489', '45457b5021de4c878019514e70ef21bc');
insert into course (id, dept_abbr, course_name, course_num)
values ('1dc17e66bf6e429f9233b08d10bb11db', 'BIME', 'Cardiovascular Electrophysiol', '6300');
insert into course (id, dept_abbr, course_name, course_num)
values ('ab0f42424ae240dfae150fc8c970f0de', 'ACCT', 'Managerial Accounting', '2521');
insert into course (id, dept_abbr, course_name, course_num)
values ('16dcac113a47443d935ab1cae561cfc6', 'ACCT', 'Intermediate Accounting I', '3551');
insert into course (id, dept_abbr, course_name, course_num)
values ('ee04d206d72e45da8c2c9306af9d5030', 'ART', 'Digital Design', '1025');
insert into course (id, dept_abbr, course_name, course_num)
values ('7ba7d9504a6f474fb8994c16e400cad6', 'ART', 'Figure Drawing', '1030');
insert into course (id, dept_abbr, course_name, course_num)
values ('76adefec7fda4ed893a40bbe9b57f653', 'EDUC', 'Foundations of American Educ', '3200');
insert into course (id, dept_abbr, course_name, course_num)
values ('cf8d861c25bc48e989e79df3b75464b5', 'EDUC', 'Introduction to Diversity', '3002');
insert into course (id, dept_abbr, course_name, course_num)
values ('37fc6954df424f018fdd6bd92eac4cef', 'JUST', 'Crime and Criminality', '2004');
insert into course (id, dept_abbr, course_name, course_num)
values ('4feadbfcfa774120959d1628b6418565', 'JUST', 'Correctional Systems', '2009');
#insert into post (id,user_id,course_id,post_text,posdt_status) 
#values('id','user_id','course_id','post_text','post_status');
