import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Enrollment from '../models/Enrollment.js';
import FacultyAssignment from '../models/FacultyAssignment.js';

dotenv.config();

const seedRealData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Subject.deleteMany({});
    await Enrollment.deleteMany({});
    await FacultyAssignment.deleteMany({});

    // Create Faculty Members from the provided data
    const facultyUsers = await User.create([
      {
        username: 'u.sairam',
        password: 'password123',
        name: 'Mr. U. Sai Ram',
        role: 'faculty'
      },
      {
        username: 'b.harishgoud',
        password: 'password123',
        name: 'Dr. B. Harish Goud',
        role: 'faculty'
      },
      {
        username: 'sai.venkat',
        password: 'password123',
        name: 'Mr. Sai Venkat',
        role: 'faculty'
      }
    ]);

    // Create Faculty Profiles
    const faculties = await Faculty.create([
      {
        user: facultyUsers[0]._id,
        name: 'Mr. U. Sai Ram',
        email: 'u.sairam@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[1]._id,
        name: 'Dr. B. Harish Goud',
        email: 'b.harishgoud@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Professor'
      },
      {
        user: facultyUsers[2]._id,
        name: 'Mr. Sai Venkat',
        email: 'sai.venkat@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      }
    ]);

    // Create Subjects
    const subjects = await Subject.create([
      {
        code: '22CIE55',
        name: 'Cyber Security',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITE04',
        name: 'Software Project Management',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      }
    ]);

    // Student data from the provided lists
    const studentData = [
      // Cyber Security Section I (Mr. U. Sai Ram) - IT-1 & IT-2
      { rollNo: '160123737001', name: 'APPALA MEENAKSHI SINDHUJA', section: 'IT-1' },
      { rollNo: '160123737002', name: 'ARIBA FATIMA', section: 'IT-1' },
      { rollNo: '160123737004', name: 'BANAVATH ANUSHA', section: 'IT-1' },
      { rollNo: '160123737005', name: 'BASSA. SRILAKSHMI', section: 'IT-1' },
      { rollNo: '160123737006', name: 'B.SRIMUGDHA', section: 'IT-1' },
      { rollNo: '160123737008', name: 'BONALA. LAXMI PRASANNA', section: 'IT-1' },
      { rollNo: '160123737011', name: 'DAIDALA RUTHVIKA REDDY', section: 'IT-1' },
      { rollNo: '160123737012', name: 'DEVANABOYINA CHANDANA', section: 'IT-1' },
      { rollNo: '160123737013', name: 'SAHASRA', section: 'IT-1' },
      { rollNo: '160123737014', name: 'KHAZI AAFREEN', section: 'IT-1' },
      { rollNo: '160123737015', name: 'M ANUSREE', section: 'IT-1' },
      { rollNo: '160123737016', name: 'M ADITI', section: 'IT-1' },
      { rollNo: '160123737017', name: 'MARPALLI NIKHITHA SREE', section: 'IT-1' },
      { rollNo: '160123737018', name: 'MATTAM SAHITHI', section: 'IT-1' },
      { rollNo: '160123737019', name: 'NILAGAL NAVARATNA', section: 'IT-1' },
      { rollNo: '160123737020', name: 'NANDINI PERVAR', section: 'IT-1' },
      { rollNo: '160123737021', name: 'SAMIKSHA PODICHETTY', section: 'IT-1' },
      { rollNo: '160123737022', name: 'VASUNDHRA DEVI', section: 'IT-1' },
      { rollNo: '160123737024', name: 'SAHITI EDUPUGANTI', section: 'IT-1' },
      { rollNo: '160123737026', name: 'SK ALMASE GOHER', section: 'IT-1' },
      { rollNo: '160123737027', name: 'SOUMYA VEMURI', section: 'IT-1' },
      { rollNo: '160123737028', name: 'NIKITHA YAMSANI', section: 'IT-1' },
      { rollNo: '160123737029', name: 'ABDUL RAHEEM', section: 'IT-1' },
      { rollNo: '160123737032', name: 'A VISHNU VARDHAN REDDY', section: 'IT-1' },
      { rollNo: '160123737034', name: 'B VISHNUVARDAN', section: 'IT-1' },
      { rollNo: '160123737037', name: 'SURYA VARMA CHERUKURI', section: 'IT-1' },
      { rollNo: '160123737038', name: 'D.THIRUPATHI', section: 'IT-1' },
      { rollNo: '160123737039', name: 'GANDHARI VARUN REDDY', section: 'IT-1' },
      { rollNo: '160123737040', name: 'GUDIBANDA KRISHNA MANOHAR REDDY', section: 'IT-1' },
      { rollNo: '160123737041', name: 'HRUTHIK', section: 'IT-1' },
      { rollNo: '160123737042', name: 'K.H.HARSH', section: 'IT-1' },
      { rollNo: '160123737043', name: 'K.MANICHANDER', section: 'IT-1' },
      { rollNo: '160123737044', name: 'K.MANMOHAN RATHOD', section: 'IT-1' },
      { rollNo: '160123737045', name: 'KETHAVATH NAVEEN', section: 'IT-1' },
      { rollNo: '160123737046', name: 'AKASH', section: 'IT-1' },
      { rollNo: '160123737048', name: 'M.BHARAT KUMAR', section: 'IT-1' },
      { rollNo: '160123737050', name: 'M ABHILASH REDDY', section: 'IT-1' },
      { rollNo: '160123737051', name: 'MOHAMMED ABDUL RAFE SAJID', section: 'IT-1' },
      { rollNo: '160123737052', name: 'MOLUGU SHASHANK', section: 'IT-1' },
      { rollNo: '160123737054', name: 'NIRISH REDDY', section: 'IT-1' },
      { rollNo: '160123737055', name: 'OM UPLENCHWAR', section: 'IT-1' },
      { rollNo: '160123737056', name: 'PALLE SAIRAM GOUD', section: 'IT-1' },
      { rollNo: '160123737057', name: 'P.RUPESH KUMAR', section: 'IT-1' },
      { rollNo: '160123737058', name: 'PRATYUSH KUMAR', section: 'IT-1' },
      { rollNo: '160123737059', name: 'VYAS RALLAPALLI', section: 'IT-1' },
      { rollNo: '160123737060', name: 'SADE VARUN TEJ VARMA', section: 'IT-1' },
      { rollNo: '160123737061', name: 'SARVESH JHAWAR', section: 'IT-1' },
      { rollNo: '160123737062', name: 'SURYA PRANAY GOUD', section: 'IT-1' },
      { rollNo: '160123737063', name: 'SWETHAK SWARNA', section: 'IT-1' },
      { rollNo: '160123737064', name: 'THATIKONDA VIKRAM', section: 'IT-1' },
      { rollNo: '160123737065', name: 'VEMURI VENKATA PHANI KUMAR', section: 'IT-1' },
      { rollNo: '161023737301', name: 'A SAI PRAKASH', section: 'IT-1' },
      { rollNo: '160123737303', name: 'NAGARAJU RODOPOLLU', section: 'IT-1' },
      { rollNo: '160123737304', name: 'GANDHASIRI SATHWIKA', section: 'IT-1' },
      { rollNo: '160123737305', name: 'GUNDELLY SRUJANA', section: 'IT-1' },
      { rollNo: '160123737306', name: 'ANGADI JYOTHSNA', section: 'IT-1' },
      { rollNo: '160123737307', name: 'BANOTH SRIDEVI', section: 'IT-1' },
      { rollNo: '160123737071', name: 'AMETI AKSHITHA', section: 'IT-2' },
      { rollNo: '160123737072', name: 'HAMSAGOUNI RITHIKA', section: 'IT-2' },
      { rollNo: '160123737073', name: 'KANDIMALLA SONY', section: 'IT-2' },
      { rollNo: '160123737074', name: 'LAKSHANA.S', section: 'IT-2' },
      { rollNo: '160123737075', name: 'MEGHANA', section: 'IT-2' },
      { rollNo: '160123737076', name: 'MEHERUNNISA', section: 'IT-2' },
      { rollNo: '160123737077', name: 'NIMMALA MADHURI', section: 'IT-2' },
      { rollNo: '160123737079', name: 'PATI TEJASWINI', section: 'IT-2' },
      { rollNo: '160123737080', name: 'POLKAMPALLI PRAGNA', section: 'IT-2' },
      { rollNo: '160123737081', name: 'SAHITHI', section: 'IT-2' },
      { rollNo: '160123737083', name: 'NIRUPAMA', section: 'IT-2' },
      { rollNo: '160123737084', name: 'SRIRAMPURAM SUDHIKSHA REDDY', section: 'IT-2' },
      { rollNo: '160123737085', name: 'T.RAKSHITHA', section: 'IT-2' },
      { rollNo: '160123737086', name: 'THIRUKOVELA MOULYA', section: 'IT-2' },
      { rollNo: '160123737087', name: 'MELISA BLOSSOM', section: 'IT-2' },
      { rollNo: '160123737088', name: 'PRAVALIKA', section: 'IT-2' },
      { rollNo: '160123737089', name: 'VIDIYALA ASHRITHA', section: 'IT-2' },
      { rollNo: '160123737090', name: 'VUPPULAPU BHAVYA', section: 'IT-2' },
      { rollNo: '160123737091', name: 'HARSHITA VUTHALURU', section: 'IT-2' },
      { rollNo: '160123737093', name: 'ABHIJITH DUGGARAJU', section: 'IT-2' },
      { rollNo: '160123737094', name: 'ABHISHEK KUMAR SINGH', section: 'IT-2' },

      // Cyber Security Section II (Dr. B. Harish Goud) - IT-2 & IT-3
      { rollNo: '160123737096', name: 'ALETI ANUDEEP REDDY', section: 'IT-2' },
      { rollNo: '160123737097', name: 'ASHISH GUPTA', section: 'IT-2' },
      { rollNo: '160123737098', name: 'BANDI SAI RISHWANTH', section: 'IT-2' },
      { rollNo: '160123737102', name: 'DODDA JITENDRA', section: 'IT-2' },
      { rollNo: '160123737103', name: 'D.RUPESH REDDY', section: 'IT-2' },
      { rollNo: '160123737104', name: 'SHIVA GANGISHETTY', section: 'IT-2' },
      { rollNo: '160123737105', name: 'G.NITHISH KUMAR', section: 'IT-2' },
      { rollNo: '160123737108', name: 'INDROJI SAI SUSHANK', section: 'IT-2' },
      { rollNo: '160123737109', name: 'JAJIMOGGALA SUNIL', section: 'IT-2' },
      { rollNo: '160123737110', name: 'K.SANCHAY JAIN', section: 'IT-2' },
      { rollNo: '160123737111', name: 'K.SAI KIRAN', section: 'IT-2' },
      { rollNo: '160123737112', name: 'KALYANAM ROSHAN VARMA', section: 'IT-2' },
      { rollNo: '160123737114', name: 'HARSHITH MANIK', section: 'IT-2' },
      { rollNo: '160123737115', name: 'KANATALA SIDDHARTHA', section: 'IT-2' },
      { rollNo: '160123737116', name: 'CHARAN KANKIPATI', section: 'IT-2' },
      { rollNo: '160123737117', name: 'J.KARTHIKEYA', section: 'IT-2' },
      { rollNo: '160123737118', name: 'KOTA PUNNAM', section: 'IT-2' },
      { rollNo: '160123737119', name: 'K.SRISAI', section: 'IT-2' },
      { rollNo: '160123737121', name: 'M. NAVEEN KUMAR', section: 'IT-2' },
      { rollNo: '160123737123', name: 'MAJJI SANDEEP', section: 'IT-2' },
      { rollNo: '160123737124', name: 'MOHD HASSAN', section: 'IT-2' },
      { rollNo: '160123737126', name: 'NALLAPOTHULA SHEKAR NAIDU', section: 'IT-2' },
      { rollNo: '160123737127', name: 'N.MANISH', section: 'IT-2' },
      { rollNo: '160123737128', name: 'P.V.ABHIRAM', section: 'IT-2' },
      { rollNo: '160123737129', name: 'POLICE VIGNESHWAR REDDY', section: 'IT-2' },
      { rollNo: '160123737130', name: 'REKULARAPU MURALI', section: 'IT-2' },
      { rollNo: '160123737133', name: 'PRANAVENDRA', section: 'IT-2' },
      { rollNo: '160123737135', name: 'SUSHANTH REDDY KASIREDDY', section: 'IT-2' },
      { rollNo: '160123737308', name: 'CHITTURI NAGA RAJA TEJA ROHITH', section: 'IT-2' },
      { rollNo: '160123737309', name: 'MOTHKURI RANVITHA', section: 'IT-2' },
      { rollNo: '160123737310', name: 'KARNATAKAPU RAMAKRISHNA', section: 'IT-2' },
      { rollNo: '160123737311', name: 'THATIKANTI ROHITH', section: 'IT-2' },
      { rollNo: '160123737313', name: 'AKKENAPALLY NIKHIL', section: 'IT-2' },
      { rollNo: '160123737314', name: 'BANOTH ANIL', section: 'IT-2' },
      { rollNo: '160123737144', name: 'B. PRIYANKA', section: 'IT-3' },
      { rollNo: '160123737145', name: 'BHAVANA RAMAKRISHNA', section: 'IT-3' },
      { rollNo: '160123737147', name: 'CHINTHAKINDHI NISHITHA', section: 'IT-3' },
      { rollNo: '160123737148', name: 'E.SPANDANA', section: 'IT-3' },
      { rollNo: '160123737149', name: 'GAALI SAI PRAHARSHITA', section: 'IT-3' },
      { rollNo: '160123737150', name: 'GADASANDULA AKSHATHA', section: 'IT-3' },
      { rollNo: '160123737154', name: 'M.PRAVALLIKA REDDY', section: 'IT-3' },
      { rollNo: '160123737155', name: 'MANASA MORTHAD', section: 'IT-3' },
      { rollNo: '160123737158', name: 'POCHAMPELLY DEEKSHITHA', section: 'IT-3' },
      { rollNo: '160123737160', name: 'P.DHANUSHKA', section: 'IT-3' },
      { rollNo: '160123737161', name: 'RIDA SHAIK', section: 'IT-3' },
      { rollNo: '160123737163', name: 'SHRAVYA JALLEPALLY', section: 'IT-3' },
      { rollNo: '160123737164', name: 'SISTLA KEERTHANA', section: 'IT-3' },
      { rollNo: '160123737166', name: 'SURYAPETA SRAVANI', section: 'IT-3' },
      { rollNo: '160123737167', name: 'SRICHANDANA', section: 'IT-3' },
      { rollNo: '160123737168', name: 'AMBEER SHRAVAN KUMAR', section: 'IT-3' },
      { rollNo: '160123737169', name: 'ASHISH PATHAK', section: 'IT-3' },
      { rollNo: '160123737174', name: 'B. JAYANTH REDDY', section: 'IT-3' },
      { rollNo: '160123737175', name: 'CH.SAI NITHIN REDDY', section: 'IT-3' },
      { rollNo: '160123737176', name: 'HANOK KANNA', section: 'IT-3' },
      { rollNo: '160123737179', name: 'GODISHALA ASHWITH', section: 'IT-3' },
      { rollNo: '160123737180', name: 'IMTISAL HUSSAIN RANGREZ', section: 'IT-3' },
      { rollNo: '160123737183', name: 'K.RAJ GURU', section: 'IT-3' },
      { rollNo: '160123737186', name: 'KORPOLE KRISHNA KARTHIK REDDY', section: 'IT-3' },
      { rollNo: '160123737187', name: 'KURUVELLA SAI BALAJI', section: 'IT-3' },
      { rollNo: '160123737188', name: 'SATVIK REDDY', section: 'IT-3' },
      { rollNo: '160123737189', name: 'SRUJAN NAYAK', section: 'IT-3' },
      { rollNo: '160123737191', name: 'MEHMOOD ALI', section: 'IT-3' },
      { rollNo: '160123737193', name: 'MELLAM ANISH', section: 'IT-3' },
      { rollNo: '160123737194', name: 'MERUGU SAIKOUSHIK', section: 'IT-3' },
      { rollNo: '160123737195', name: 'MOHAMMED FAIZAN UL ISLAM', section: 'IT-3' },
      { rollNo: '160123737199', name: 'PASHAM KARTHIK', section: 'IT-3' },
      { rollNo: '160123737200', name: 'PATNALA ABINAYKUMAR', section: 'IT-3' },
      { rollNo: '160123737201', name: 'ABHIRAM POLA', section: 'IT-3' },
      { rollNo: '160123737202', name: 'RAHUL ARRA', section: 'IT-3' },
      { rollNo: '160123737203', name: 'RAMAVATH NAVEEN', section: 'IT-3' },
      { rollNo: '160123737204', name: 'SARIKELLA MADHU', section: 'IT-3' },
      { rollNo: '160123737205', name: 'THODUPUNOORI SAI MANISH', section: 'IT-3' },
      { rollNo: '160123737206', name: 'ROHIT THOTA', section: 'IT-3' },
      { rollNo: '160123737207', name: 'VEDITH VANAM', section: 'IT-3' },
      { rollNo: '160123737315', name: 'MALE VIGNESHWAR REDDY', section: 'IT-3' },
      { rollNo: '160123737318', name: 'BOBBALA VARSHINI', section: 'IT-3' },
      { rollNo: '160123737319', name: 'AKBER HUSSAIN', section: 'IT-3' },
      { rollNo: '160123737320', name: 'MAISA ANUSHKA', section: 'IT-3' },

      // Software Project Management (Mr. Sai Venkat) - Mixed sections
      { rollNo: '160123737003', name: 'HIRANMAI BANALA', section: 'IT-1' },
      { rollNo: '160123737007', name: 'BHUKYA SWAPNA', section: 'IT-1' },
      { rollNo: '160123737009', name: 'TRISHACHALLA', section: 'IT-1' },
      { rollNo: '160123737010', name: 'CHEEMARLA RISHITHA', section: 'IT-1' },
      { rollNo: '160123737023', name: 'RASHI KAUR', section: 'IT-1' },
      { rollNo: '160123737025', name: 'JENNIFER SHALOM', section: 'IT-1' },
      { rollNo: '160123737030', name: 'AMIT KUMAR', section: 'IT-1' },
      { rollNo: '160123737031', name: 'ANISH KODURU', section: 'IT-1' },
      { rollNo: '160123737033', name: 'AYUSH KUMAR SINGH', section: 'IT-1' },
      { rollNo: '160123737035', name: 'B.SAI LOHITH', section: 'IT-1' },
      { rollNo: '160123737036', name: 'BOINI VIVEK', section: 'IT-1' },
      { rollNo: '160123737047', name: 'L. NITHISH NAIK', section: 'IT-1' },
      { rollNo: '160123737049', name: 'MEDAPALLY SHIVA REDDY', section: 'IT-1' },
      { rollNo: '160123737053', name: 'N YASHWANTH SARMA', section: 'IT-1' },
      { rollNo: '160123737066', name: 'VOTUKURU NOMESH REDDY', section: 'IT-1' },
      { rollNo: '160123737067', name: 'YARRABOTHULA DILEEP', section: 'IT-1' },
      { rollNo: '160123737082', name: 'SARASWATULA SAMHITHA', section: 'IT-2' },
      { rollNo: '160123737092', name: 'ABDUL GAFOOR', section: 'IT-2' },
      { rollNo: '160123737095', name: 'A.BHARGAVA KRISHNA', section: 'IT-2' },
      { rollNo: '160123737099', name: 'REVANTH BOJJA', section: 'IT-2' },
      { rollNo: '160123737101', name: 'DIRISINAPU JYOTHI VIKRAMA SIMHA REDDY', section: 'IT-2' },
      { rollNo: '160123737106', name: 'GRANDHI AVINASH', section: 'IT-2' },
      { rollNo: '160123737107', name: 'GULLA MANEESH', section: 'IT-2' },
      { rollNo: '160123737113', name: 'K PREMSAGAR', section: 'IT-2' },
      { rollNo: '160123737120', name: 'LAKSH JAIN', section: 'IT-2' },
      { rollNo: '160123737122', name: 'M.VEDAANTH SINGH', section: 'IT-2' },
      { rollNo: '160123737125', name: 'YOGESH CHOUDHARY', section: 'IT-2' },
      { rollNo: '160123737131', name: 'S SAI ASHRITH V R K N', section: 'IT-2' },
      { rollNo: '160123737132', name: 'SAMA ASHOK', section: 'IT-2' },
      { rollNo: '160123737134', name: 'SHAIK AQEEL AHAMED', section: 'IT-2' },
      { rollNo: '160123737136', name: 'T PREETHAM REDDY', section: 'IT-2' },
      { rollNo: '160123737137', name: 'TUNGENA SHARATH', section: 'IT-2' },
      { rollNo: '160123737312', name: 'SINDHUJA BODDULA', section: 'IT-2' },
      { rollNo: '160123737141', name: 'AMJA MAITHILI', section: 'IT-3' },
      { rollNo: '160123737142', name: 'AVANI CHETLURI', section: 'IT-3' },
      { rollNo: '160123737143', name: 'SONALI BANAPURAM', section: 'IT-3' },
      { rollNo: '160123737146', name: 'BOBBALA HARSHITHA', section: 'IT-3' },
      { rollNo: '160123737151', name: 'KANDHURI SAI RASAGNA', section: 'IT-3' },
      { rollNo: '160123737152', name: 'MADATHANAPALLE LEENA', section: 'IT-3' },
      { rollNo: '160123737153', name: 'M VEDA SRI', section: 'IT-3' },
      { rollNo: '160123737156', name: 'MIDDE JAHNAVI', section: 'IT-3' },
      { rollNo: '160123737157', name: 'HARSHITHA', section: 'IT-3' },
      { rollNo: '160123737159', name: 'PRIYANSHU NERELLA', section: 'IT-3' },
      { rollNo: '160123737162', name: 'SAMEEKSHA PADIGELAWAR', section: 'IT-3' },
      { rollNo: '160123737165', name: 'SRIJA SRIRAMDAS', section: 'IT-3' },
      { rollNo: '160123737170', name: 'BAIRY SHIVA KARTHIK', section: 'IT-3' },
      { rollNo: '160123737171', name: 'BANDARI LAKSHMANA PRASAD', section: 'IT-3' },
      { rollNo: '160123737172', name: 'BATTIPROLU SAI JEEVAN', section: 'IT-3' },
      { rollNo: '160123737173', name: 'BHARGAV KOLLURU', section: 'IT-3' },
      { rollNo: '160123737177', name: 'D. RITHWIK MOHAN', section: 'IT-3' },
      { rollNo: '160123737178', name: 'GARREPALLY RAMA RAGHAVA', section: 'IT-3' },
      { rollNo: '160123737181', name: 'JAKKU SANTHOSH REDDY', section: 'IT-3' },
      { rollNo: '160123737182', name: 'KADIMI VENKATA SHASHANK YADAV', section: 'IT-3' },
      { rollNo: '160123737184', name: 'MOHIT NAREN', section: 'IT-3' },
      { rollNo: '160123737185', name: 'VARUNDEEP REDDY KODURU', section: 'IT-3' },
      { rollNo: '160123737190', name: 'MANUVARTHI SESHADRI NAIDU', section: 'IT-3' },
      { rollNo: '160123737192', name: 'MEKA VIRJ', section: 'IT-3' },
      { rollNo: '160123737196', name: 'N S SASHANK EMMIDI', section: 'IT-3' },
      { rollNo: '160123737197', name: 'NAGAM SRIVATSAV REDDY', section: 'IT-3' },
      { rollNo: '160123737198', name: 'NIKHIL GEORGE', section: 'IT-3' },
      { rollNo: '160123737316', name: 'BORRA PUJITH GANESH', section: 'IT-3' },
      { rollNo: '160123737317', name: 'NAGUNURI SHASHIDHAR', section: 'IT-3' }
    ];

    // Create all students
    const allStudents = [];
    for (const studentInfo of studentData) {
      const user = await User.create({
        username: studentInfo.rollNo,
        password: 'password123',
        name: studentInfo.name,
        role: 'student'
      });

      const student = await Student.create({
        user: user._id,
        rollNo: studentInfo.rollNo,
        name: studentInfo.name,
        section: studentInfo.section,
        year: 2,
        semester: 5,
        department: 'Information Technology',
        mentor: faculties[0]._id // Default mentor
      });
      allStudents.push(student);
    }

    // Create Faculty Assignments based on the provided data
    await FacultyAssignment.create([
      // Cyber Security Section I - Mr. U. Sai Ram
      {
        faculty: faculties[0]._id,
        subject: subjects[0]._id, // Cyber Security
        sections: ['IT-1', 'IT-2'],
        semester: 5,
        academicYear: '2025-26',
        electiveSection: 'CS_SECTION-I'
      },
      // Cyber Security Section II - Dr. B. Harish Goud
      {
        faculty: faculties[1]._id,
        subject: subjects[0]._id, // Cyber Security
        sections: ['IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2025-26',
        electiveSection: 'CS_SECTION-II'
      },
      // Software Project Management - Mr. Sai Venkat
      {
        faculty: faculties[2]._id,
        subject: subjects[1]._id, // Software Project Management
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2025-26',
        electiveSection: 'SPM_SECTION-1'
      }
    ]);

    // Enroll students in their respective elective subjects
    for (const student of allStudents) {
      const studentInfo = studentData.find(s => s.rollNo === student.rollNo);
      
      if (studentInfo) {
        // Determine which subject the student is enrolled in based on the provided lists
        let subjectId;
        let facultyId;
        
        // Check if student is in Cyber Security Section I
        const csSectionI = [
          '160123737001', '160123737002', '160123737004', '160123737005', '160123737006',
          '160123737008', '160123737011', '160123737012', '160123737013', '160123737014',
          '160123737015', '160123737016', '160123737017', '160123737018', '160123737019',
          '160123737020', '160123737021', '160123737022', '160123737024', '160123737026',
          '160123737027', '160123737028', '160123737029', '160123737032', '160123737034',
          '160123737037', '160123737038', '160123737039', '160123737040', '160123737041',
          '160123737042', '160123737043', '160123737044', '160123737045', '160123737046',
          '160123737048', '160123737050', '160123737051', '160123737052', '160123737054',
          '160123737055', '160123737056', '160123737057', '160123737058', '160123737059',
          '160123737060', '160123737061', '160123737062', '160123737063', '160123737064',
          '160123737065', '161023737301', '160123737303', '160123737304', '160123737305',
          '160123737306', '160123737307', '160123737071', '160123737072', '160123737073',
          '160123737074', '160123737075', '160123737076', '160123737077', '160123737079',
          '160123737080', '160123737081', '160123737083', '160123737084', '160123737085',
          '160123737086', '160123737087', '160123737088', '160123737089', '160123737090',
          '160123737091', '160123737093', '160123737094'
        ];

        // Cyber Security Section II
        const csSectionII = [
          '160123737096', '160123737097', '160123737098', '160123737102', '160123737103',
          '160123737104', '160123737105', '160123737108', '160123737109', '160123737110',
          '160123737111', '160123737112', '160123737114', '160123737115', '160123737116',
          '160123737117', '160123737118', '160123737119', '160123737121', '160123737123',
          '160123737124', '160123737126', '160123737127', '160123737128', '160123737129',
          '160123737130', '160123737133', '160123737135', '160123737308', '160123737309',
          '160123737310', '160123737311', '160123737313', '160123737314', '160123737144',
          '160123737145', '160123737147', '160123737148', '160123737149', '160123737150',
          '160123737154', '160123737155', '160123737158', '160123737160', '160123737161',
          '160123737163', '160123737164', '160123737166', '160123737167', '160123737168',
          '160123737169', '160123737174', '160123737175', '160123737176', '160123737179',
          '160123737180', '160123737183', '160123737186', '160123737187', '160123737188',
          '160123737189', '160123737191', '160123737193', '160123737194', '160123737195',
          '160123737199', '160123737200', '160123737201', '160123737202', '160123737203',
          '160123737204', '160123737205', '160123737206', '160123737207', '160123737315',
          '160123737318', '160123737319', '160123737320'
        ];

        // Software Project Management
        const spmStudents = [
          '160123737003', '160123737007', '160123737009', '160123737010', '160123737023',
          '160123737025', '160123737030', '160123737031', '160123737033', '160123737035',
          '160123737036', '160123737047', '160123737049', '160123737053', '160123737066',
          '160123737067', '160123737082', '160123737092', '160123737095', '160123737099',
          '160123737101', '160123737106', '160123737107', '160123737113', '160123737120',
          '160123737122', '160123737125', '160123737131', '160123737132', '160123737134',
          '160123737136', '160123737137', '160123737312', '160123737141', '160123737142',
          '160123737143', '160123737146', '160123737151', '160123737152', '160123737153',
          '160123737156', '160123737157', '160123737159', '160123737162', '160123737165',
          '160123737170', '160123737171', '160123737172', '160123737173', '160123737177',
          '160123737178', '160123737181', '160123737182', '160123737184', '160123737185',
          '160123737190', '160123737192', '160123737196', '160123737197', '160123737198',
          '160123737316', '160123737317'
        ];

        if (csSectionI.includes(studentInfo.rollNo)) {
          subjectId = subjects[0]._id; // Cyber Security
          facultyId = faculties[0]._id; // Mr. U. Sai Ram
        } else if (csSectionII.includes(studentInfo.rollNo)) {
          subjectId = subjects[0]._id; // Cyber Security
          facultyId = faculties[1]._id; // Dr. B. Harish Goud
        } else if (spmStudents.includes(studentInfo.rollNo)) {
          subjectId = subjects[1]._id; // Software Project Management
          facultyId = faculties[2]._id; // Mr. Sai Venkat
        }

        if (subjectId && facultyId) {
          await Enrollment.create({
            student: student._id,
            subject: subjectId,
            faculty: facultyId,
            section: studentInfo.section,
            semester: 5,
            chosenAsElective: true,
            electiveGroup: 'Professional Elective - 2'
          });
        }
      }
    }

    console.log('Real student data seeded successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Faculty:');
    console.log('Username: u.sairam');
    console.log('Password: password123');
    console.log('\nUsername: b.harishgoud');
    console.log('Password: password123');
    console.log('\nUsername: sai.venkat');
    console.log('Password: password123');
    console.log('\nStudent:');
    console.log('Username: 160123737164'); // SISTLA KEERTHANA
    console.log('Password: password123');
    console.log('\n========================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding real data:', error);
    process.exit(1);
  }
};

seedRealData();
