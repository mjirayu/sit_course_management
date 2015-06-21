PBL Project

ช่วย Validate กับ Pre requirement
Drag and Drop and Validate เพราะ หลักสูตร
ระบบโชว์ Default Plan ในหน้าแรก
มีฝั่งนักเรียน กับ ฝั่งอาจารย์
อาจารย์สามารถเอาข้อมูลไปแพลนจากนักเรียนที่จัดมา
เหลือกี่ตัวจบ ขาดอะไร แผนต้องลงอะไรบ้าง แพลนไปแลกเปลี่ยน
มี Report ให้กับอาจารย์ต้องคุยอีกที
วิชา Pre requirement อาจเกิดการ overwrite 
มีระบบแจ้งให้ อาจารย์ ปลดล็อค
Resource ใช้ของคณะ
Support Mobile Version 


Conditions
Condition JSON ผ่าน Attribute HTML tag data-course-con
จะขึ้นสีถ้าแดงถ้า Drag ขึ้นมาแล้ว Condition ไม่ผ่าน (ลงไม่ได้) ถ้าปกติก็เขียว
ลงที่สีแดงได้ แต่จะมีเตือน => เด๋วอาจารย์ต้อง Confirm
ทำ Submit ส่ง Request ไปสักหน้า (check condition 2 round)

Plan 
มีค่า Default แพลนให้ก่อน
สามารถสร้าง Plan ใหม่ได้ จากอันเดิม


Condition Task
ทำ Function เช็ค Condition ผ่านตัว JSON Attribute 
ทำ Interface ให้กับ Placeholder (เขียว, แดง) จากเช็ค Condition
ทำ Yes No ตอนลงสีแดง
ทำ Submit เพื่อส่ง JSON ไปเช็คกับ PHP และรับ Response

Plan Task
ทำ Function Render Plan จากข้อมูลของเรา
ทำปุ่มสร้าง Plan ใหม่จาก Plan ที่มีไว้

เงื่อนไข
Pre-require
หน่วยกิจไม่เกิน 24 แจ้งเตือน
หน่วยกิจเกิน 18 แจ้งเตือน
ปี 1 ปี 2 แจ้งลงวิชาเลือก


JSON
{
   ‘pre-req’: JSON อีกก้อน Course ID
   ’หน่วยกิจ’: เท่าไหร่
   ‘recommend-year’:  
}

Table Plan
plan_name
plan_course
plan_description
student_id
message
status

Table Course
course_name
course_id
credit
instructor
pre-requirement
recommend_year
description
pdf_file

User
firstname
lastname
student_id
address
stuent_email
password
is_active
is_staff
last_update

