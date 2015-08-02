PBL Project

1. ช่วย Validate กับ Pre requirement
2. Drag and Drop and Validate เพราะ หลักสูตร
3. ระบบโชว์ Default Plan ในหน้าแรก
4. มีฝั่งนักเรียน กับ ฝั่งอาจารย์
5. อาจารย์สามารถเอาข้อมูลไปแพลนจากนักเรียนที่จัดมา
6. เหลือกี่ตัวจบ ขาดอะไร แผนต้องลงอะไรบ้าง แพลนไปแลกเปลี่ยน
7. มี Report ให้กับอาจารย์ต้องคุยอีกที
8. วิชา Pre requirement อาจเกิดการ overwrite
9. มีระบบแจ้งให้ อาจารย์ ปลดล็อค
10. Resource ใช้ของคณะ
11. Support Mobile Version


Conditions

1. Condition JSON ผ่าน Attribute HTML tag data-course-con
2. จะขึ้นสีถ้าแดงถ้า Drag ขึ้นมาแล้ว Condition ไม่ผ่าน (ลงไม่ได้) ถ้าปกติก็เขียว
3. ลงที่สีแดงได้ แต่จะมีเตือน => เด๋วอาจารย์ต้อง Confirm
4. ทำ Submit ส่ง Request ไปสักหน้า (check condition 2 round)

Plan

1. มีค่า Default แพลนให้ก่อน
2. สามารถสร้าง Plan ใหม่ได้ จากอันเดิม


Condition Task

1. ทำ Function เช็ค Condition ผ่านตัว JSON Attribute
2. ทำ Interface ให้กับ Placeholder (เขียว, แดง) จากเช็ค Condition
3. ทำ Yes No ตอนลงสีแดง
4. ทำ Submit เพื่อส่ง JSON ไปเช็คกับ PHP และรับ Response

Plan Task

1. ทำ Function Render Plan จากข้อมูลของเรา
2.ทำปุ่มสร้าง Plan ใหม่จาก Plan ที่มีไว้

เงื่อนไข

1. Pre-require
2. หน่วยกิจไม่เกิน 24 แจ้งเตือน
3. หน่วยกิจเกิน 18 แจ้งเตือน
4. ปี 1 ปี 2 แจ้งลงวิชาเลือก

```
JSON
{
   ‘pre-req’: JSON อีกก้อน Course ID
   ’หน่วยกิจ’: เท่าไหร่
   ‘recommend-year’:  
}
```

Login Page
Task
  Front End Login Page (OAT)
  Model User
    firstname
    lastname
    student_id
    address
    department
    stuent_email
    password
    is_active
    is_staff
    entranced_year
    last_update
  ใช้ passport local authentication
  Login success redirect to show course plans page

Show Course Plans
Task
  Create Courses Plan Model
    plan_name
    plan_course
    plan_description
    student_id
    message
    status
    department
    type
  Front End (OAT)
  Use Express for query data from mongo
  Then send to Angular for binding data
  Add function add new courses plan
  Duplicate course plan from default plan (Can choose default plan)
  Delete custom course plans but cannot delete default course plan

Edit Course List
Task
  Create Courses Model
    course_name
    course_id
    credit
    instructor
    department
    pre-requirement
    recommend_year
    description
    pdf_file
  Front End (OAT)
  Drag and Drop
  Add new Years
  Send JSON when submit data
  Use express get Data from submit form
  Use express get all course list in this plan (IT, CS)

Waiting for Approve Course Plan
Task
  Front End (OAT)
  Use express route and query data from course plan
  Update status function
  pending
  approve
  reject

View Default Course Plan
Task
  Use express route and query data from course plan type default
  Front End (OAT)

Edit Default Course List ( เหมือน Edit Course List )

Insert/Edit Course
Task
  Front End (OAT)
  send request post to mongo
  Use express to add data to mongo
  Use express to update data to mongo
