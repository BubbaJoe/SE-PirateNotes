#https://www.guidgenerator.com/online-guid-generator.aspx
#use the link above to generate uuid/guid
#HASH $2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy = 123

# Users
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('2d29c09cb9be4293ac690b75531e1489', 'a@gmail.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Naruto', 'Uzimaki', 'general', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('f3e0023dea584c07ac7e78e9dc6a4729', 'b@gmail.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Itachi', 'Uchiha', 'mod', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('5eca01a62b8f4753a579dbbbbfb79c12', 'c@gmail.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Ozair', 'Shareef', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('40bcee06412f47908691e7fe52102199', 'name@email.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Joe', 'Williams', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('60e2da55449f4d8fa513614c72b48d80', 'e@gmail.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Will', 'Brimson', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('1346ad8844b94a4a8ae76f01beabea10', 'f@gmail.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Dakota', 'Long', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('e3c4b01ab9054d5bb2a601c3f4b5bf6c', 'g@gmail.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Evan', 'Loffink', 'admin', 'active');
insert into user (id, email, password, firstname, lastname, acc_type, acc_status)
values ('2a771e780a56426ca9dd1f8f1f7c0bed', 'h@gmail.com' , '$2a$10$dIi1zkuiLcfqJnaKh9JMOu0xg2uiiYqp2QZi9xi3zDcUYno19zezy' , 'Sam', 'Twaiti', 'admin', 'active');

# Departments
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

# Courses
insert into course (id, dept_abbr, course_name, course_num)
values ('42ae3034b4284f87af2539597aa4d614', 'CSCI', 'Database Management System', '3700');
insert into course (id, dept_abbr, course_name, course_num)
values ('33897a56bee3475bbef1682325327149', 'ICTN', 'Digital Communications', '2154');
insert into course (id, dept_abbr, course_name, course_num)
values ('e11227b2f84d4175a16abbc2cf2ee3df', 'MIS', 'Intro Management Info Systems', '3063');
insert into course (id, dept_abbr, course_name, course_num)
values ('4b130312720747d9996f3122f0d7ea56', 'EENG', 'Signals and Systems', '3023');
insert into course (id, dept_abbr, course_name, course_num)
values ('22133f551c6d4d8cbd503ac1b84850bf', 'ITEC', 'Thermal and Fluid Systems', '2081');
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
