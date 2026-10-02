import { IMG, SCHOOL } from './school';

export const siteContent = {
  hero: {
    eyebrow: `CBSE Affiliated · ${SCHOOL.grades} · Miyapur, Hyderabad`,
    title: 'Where Curiosity Meets Excellence',
    subtitle:
      'Empowering young minds with knowledge, confidence, creativity and character — in a caring campus built for the way children learn today.',
    primaryCta: 'Apply for Admission',
    secondaryCta: 'Explore Campus',
    image: IMG.hero,
  },
  about: {
    intro:
      'Kleos International School is a CBSE school in the heart of Miyapur, offering a balanced education from Nursery to Grade XII. Our classrooms combine the rigour of the national curriculum with inquiry-led teaching, so children learn to think, question and create — not just memorise.',
    story:
      'The name Kleos comes from the ancient Greek word for glory — not the fleeting kind, but the lasting renown that is earned through effort, integrity and service. It is the standard we hold for every child who walks through our gates.',
    vision:
      'To be a school where every child discovers their potential and grows into a confident, compassionate and responsible global citizen rooted in Indian values.',
    mission:
      'To deliver a joyful, rigorous CBSE education through skilled teachers, modern learning spaces and close partnership with families — nurturing intellect, character, health and creativity in equal measure.',
  },
  principal: {
    name: 'Mrs. Lakshmi Prasanna',
    designation: 'Principal',
    qualification: 'M.Sc., M.Ed. · 22 years in CBSE education',
    message:
      'At Kleos, we believe every child arrives with a spark. Our work is to protect that curiosity and give it direction — through teachers who know each child by name, a curriculum that asks "why" as often as "what", and a culture where kindness matters as much as marks. When parents trust us with their children, we take that responsibility personally. I warmly invite you to visit our campus and see our classrooms in action.',
    image: '',
  },
  stats: [
    { value: 12, suffix: '+', label: 'Years of Excellence' },
    { value: 1200, suffix: '+', label: 'Students Enrolled' },
    { value: 85, suffix: '+', label: 'Qualified Faculty' },
    { value: 20, suffix: '+', label: 'Clubs & Programmes' },
  ],
  admissionsBanner: {
    title: `Admissions Open for ${SCHOOL.admissionYear}`,
    text: 'Nursery to Grade IX and Grade XI (MPC, BiPC, Commerce). Limited seats per section to protect our 1:24 teacher–student ratio.',
  },
};

export const whyUs = [
  { icon: 'GraduationCap', title: 'Experienced Faculty', text: 'CBSE-trained teachers averaging 11 years of classroom experience, with 40+ hours of annual professional development.' },
  { icon: 'MonitorSmartphone', title: 'Smart Learning', text: 'Interactive panels in every classroom, a digital content library and a learning app that keeps parents in the loop.' },
  { icon: 'School', title: 'Modern Classrooms', text: 'Bright, ventilated classrooms with ergonomic furniture, reading corners and flexible group-work layouts.' },
  { icon: 'Trophy', title: 'Sports & Fitness', text: 'Daily physical education, certified coaches for cricket, football, basketball, athletics, chess and yoga.' },
  { icon: 'ShieldCheck', title: 'Safe Campus', text: 'CCTV-monitored campus, verified staff, GPS-tracked buses with lady attendants, and controlled visitor entry.' },
  { icon: 'Sparkles', title: 'Holistic Development', text: 'Music, dance, art, robotics, public speaking and life skills woven into the timetable — not bolted on.' },
];

export const programs = [
  {
    id: 'pre-primary',
    stage: 'Pre-Primary',
    grades: 'Nursery · LKG · UKG',
    ages: 'Ages 3 – 6',
    color: '#e8a53b',
    image: IMG.kidsClass,
    text: 'Play-based, Montessori-inspired early years with phonics, number sense, music and sensory play in a warm, colourful environment.',
    subjects: ['Phonics & Early Literacy', 'Number Work', 'Environmental Awareness', 'Rhymes & Music', 'Art & Craft', 'Motor Skills'],
  },
  {
    id: 'primary',
    stage: 'Primary',
    grades: 'Grades I – V',
    ages: 'Ages 6 – 11',
    color: '#2f9e6e',
    image: IMG.childStudy,
    text: 'Strong foundations in language and mathematics through activity-based learning, reading programmes and hands-on EVS projects.',
    subjects: ['English', 'Telugu', 'Hindi', 'Mathematics', 'EVS', 'Computers', 'Art, Music & Dance', 'Physical Education'],
  },
  {
    id: 'middle',
    stage: 'Middle School',
    grades: 'Grades VI – VIII',
    ages: 'Ages 11 – 14',
    color: '#2d7dd2',
    image: IMG.classroom,
    text: 'Subject specialists, lab-based science, coding and project work that help students connect ideas across disciplines.',
    subjects: ['English', 'Telugu / Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science & Coding', 'Art Education', 'Sports'],
  },
  {
    id: 'secondary',
    stage: 'Secondary',
    grades: 'Grades IX – X',
    ages: 'Ages 14 – 16',
    color: '#8a5cd0',
    image: IMG.students,
    text: 'Focused CBSE Board preparation with regular assessments, remedial support and career awareness sessions.',
    subjects: ['English', 'Telugu / Hindi', 'Mathematics (Std / Basic)', 'Science', 'Social Science', 'Artificial Intelligence', 'Health & PE'],
  },
  {
    id: 'senior-secondary',
    stage: 'Senior Secondary',
    grades: 'Grades XI – XII',
    ages: 'Ages 16 – 18',
    color: '#c8323c',
    image: IMG.graduation,
    text: 'Science (MPC / BiPC) and Commerce streams with integrated preparation for JEE, NEET and CUET.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Accountancy', 'Business Studies', 'Economics', 'English Core', 'Computer Science'],
  },
];

export const facilities = [
  { id: 'f1', name: 'Smart Classrooms', icon: 'Presentation', image: IMG.smartClass, short: 'Interactive panels in every room', description: 'Every classroom is equipped with a 75-inch interactive panel, curated digital content mapped to the CBSE syllabus, and furniture that rearranges for group work in minutes.', features: ['75" interactive flat panels', 'Curriculum-mapped digital content', 'Natural light & cross ventilation', 'Max 30 students per section'] },
  { id: 'f2', name: 'Library', icon: 'Library', image: IMG.library, short: '8,000+ books & e-resources', description: 'A quiet, sunlit library with over 8,000 titles in English, Telugu and Hindi, children’s reading nooks, periodicals and access to digital libraries for senior students.', features: ['8,000+ titles in 3 languages', 'Weekly library period for every class', 'Reading challenge & book club', 'Digital catalogue & e-library access'] },
  { id: 'f3', name: 'Computer Lab', icon: 'Monitor', image: IMG.computerLab, short: '1:1 systems, coding & AI', description: 'A networked lab with one system per student, high-speed internet, and a progression from block coding in primary to Python and AI in senior school.', features: ['40 networked workstations', 'Coding curriculum from Grade III', 'CBSE AI & IT electives', 'Supervised, filtered internet'] },
  { id: 'f4', name: 'Science Labs', icon: 'FlaskConical', image: IMG.scienceLab, short: 'Physics, Chemistry & Biology', description: 'Separate Physics, Chemistry and Biology laboratories built to CBSE norms, with safety equipment and a lab assistant for every practical session.', features: ['Dedicated Physics, Chemistry & Biology labs', 'CBSE-compliant safety systems', 'Composite lab for middle school', 'Annual science exhibition'] },
  { id: 'f5', name: 'Sports & Playground', icon: 'Trophy', image: IMG.sports, short: 'Coaching across 8 sports', description: 'Outdoor play areas, a multi-sport court and indoor games room, with certified coaches for cricket, football, basketball, athletics, kabaddi, chess, skating and yoga.', features: ['Multi-purpose sports court', 'Certified coaches', 'Indoor games & chess room', 'Inter-school tournament teams'] },
  { id: 'f6', name: 'Transport', icon: 'Bus', image: IMG.transport, short: 'GPS buses across 14 routes', description: 'A fleet of GPS-tracked buses covering Miyapur, Chandanagar, Bachupally, Nizampet, Kondapur and surrounding areas, each with a trained driver and lady attendant.', features: ['Live GPS tracking for parents', 'Lady attendant on every bus', 'Speed governors & first-aid kits', '14 routes across West Hyderabad'] },
  { id: 'f7', name: 'Safety & Security', icon: 'ShieldCheck', image: IMG.security, short: 'CCTV & controlled access', description: 'A safe campus is non-negotiable. Entry is controlled and logged, all staff are police-verified, and the campus is monitored by CCTV throughout school hours.', features: ['CCTV across campus', 'Visitor management at gate', 'Police-verified staff', 'Regular fire & evacuation drills'] },
  { id: 'f8', name: 'Medical Room', icon: 'HeartPulse', image: IMG.medical, short: 'Nurse on duty all day', description: 'A well-equipped infirmary with a qualified nurse on duty through school hours, tie-ups with nearby hospitals, and annual health check-ups for every student.', features: ['Full-time qualified nurse', 'Annual health & dental check-ups', 'Tie-up with nearby hospitals', 'Medical records for every child'] },
  { id: 'f9', name: 'Cafeteria', icon: 'UtensilsCrossed', image: IMG.cafeteria, short: 'Hygienic, nutritious meals', description: 'A clean, airy dining space serving vegetarian meals and snacks planned with a nutritionist, with strict hygiene audits every week.', features: ['Nutritionist-planned menu', 'Vegetarian kitchen', 'Weekly hygiene audits', 'RO purified drinking water on every floor'] },
  { id: 'f10', name: 'Activity Rooms', icon: 'Palette', image: IMG.art, short: 'Art, music, dance & robotics', description: 'Dedicated rooms for visual arts, Carnatic and western music, classical and contemporary dance, and a robotics & tinkering studio.', features: ['Art & craft studio', 'Music room with instruments', 'Dance studio with mirrors', 'Robotics & tinkering lab'] },
  { id: 'f11', name: 'Auditorium', icon: 'Theater', image: IMG.auditorium, short: 'Stage for every student', description: 'A multi-purpose hall for assemblies, performances, guest lectures and parent workshops, with professional sound and lighting.', features: ['Seating for 400', 'Professional sound & lighting', 'Hosts Annual Day & assemblies', 'Used for workshops & seminars'] },
];

export const activities = [
  { title: 'Robotics & Coding Club', category: 'STEM', image: IMG.robotics, text: 'Build, programme and compete — from LEGO robotics in primary to Arduino projects in middle school.' },
  { title: 'Classical & Western Dance', category: 'Performing Arts', image: IMG.dance, text: 'Kuchipudi, Bharatanatyam and contemporary dance taught by trained instructors.' },
  { title: 'Music Ensemble', category: 'Performing Arts', image: IMG.music, text: 'Carnatic vocal, keyboard, guitar and percussion with a school choir that performs at every Annual Day.' },
  { title: 'Visual Arts Studio', category: 'Arts', image: IMG.art, text: 'Drawing, painting, clay work and craft with an annual student art exhibition.' },
  { title: 'Chess Academy', category: 'Sports', image: IMG.chess, text: 'Structured coaching and FIDE-rated tournament exposure for budding players.' },
  { title: 'Football & Athletics', category: 'Sports', image: IMG.football, text: 'Coached training sessions, inter-house leagues and district-level competitions.' },
  { title: 'Yoga & Mindfulness', category: 'Wellbeing', image: IMG.yoga, text: 'Daily breathing practice and weekly yoga sessions for focus and emotional balance.' },
  { title: 'Debate & Public Speaking', category: 'Literary', image: IMG.stage, text: 'Model UN, elocution, debate and assemblies that build confident communicators.' },
];

export const houses = [
  { name: 'Aryabhata', color: '#c8323c', value: 'Inquiry' },
  { name: 'Raman', color: '#2d7dd2', value: 'Discovery' },
  { name: 'Kalam', color: '#2f9e6e', value: 'Perseverance' },
  { name: 'Tagore', color: '#e8a53b', value: 'Creativity' },
];

export const events = [
  { id: 'e1', title: 'Bathukamma & Dussehra Celebrations', date: '2026-10-16', time: '10:00 AM – 1:00 PM', location: 'School Courtyard', category: 'Cultural', image: IMG.celebration, description: 'Students and parents come together to celebrate Telangana’s floral festival with Bathukamma arrangements, folk songs and dance. Parents are welcome to join from 11 AM.' },
  { id: 'e2', title: 'Parent–Teacher Meeting (Term I)', date: '2026-10-24', time: '9:00 AM – 12:30 PM', location: 'Respective Classrooms', category: 'Academic', image: IMG.teacher, description: 'Review of Half-Yearly results and individual progress. Time slots will be shared by class teachers through the parent app.' },
  { id: 'e3', title: 'Children’s Day Carnival', date: '2026-11-14', time: '9:30 AM – 2:00 PM', location: 'Main Campus', category: 'Celebration', image: IMG.kids, description: 'Teachers perform for students, followed by game stalls, a magic show and a special lunch for all children.' },
  { id: 'e4', title: 'Kleos Science & Innovation Exhibition', date: '2026-11-28', time: '10:00 AM – 3:00 PM', location: 'Science Block & Auditorium', category: 'Academic', image: IMG.scienceLab, description: 'Over 150 student projects across physics, chemistry, biology, robotics and sustainability. Open to parents and invited schools.' },
  { id: 'e5', title: 'Annual Sports Day', date: '2026-12-12', time: '8:00 AM – 1:00 PM', location: 'School Ground', category: 'Sports', image: IMG.sports, description: 'March past, athletics, relay finals and inter-house championships. Chief guest to be announced.' },
  { id: 'e6', title: 'Annual Day — "Kalpana"', date: '2027-01-23', time: '5:00 PM – 8:30 PM', location: 'School Auditorium', category: 'Cultural', image: IMG.stage, description: 'Our annual cultural evening featuring every student on stage, with academic awards and the Principal’s annual report.' },
  { id: 'e7', title: 'Republic Day Celebration', date: '2027-01-26', time: '8:00 AM – 10:00 AM', location: 'School Ground', category: 'National', image: IMG.celebration, description: 'Flag hoisting, patriotic songs and a parade by the student council and house captains.' },
  { id: 'e8', title: 'Ganesh Chaturthi Eco-Celebration', date: '2026-09-14', time: '10:00 AM – 12:00 PM', location: 'School Courtyard', category: 'Cultural', image: IMG.art, description: 'Students crafted clay Ganesha idols and learnt about eco-friendly festival practices.' },
  { id: 'e9', title: 'Teachers’ Day', date: '2026-09-05', time: '9:00 AM – 12:00 PM', location: 'Auditorium', category: 'Celebration', image: IMG.teacher, description: 'Grade XII students ran the school for a day, followed by a cultural programme honouring our teachers.' },
  { id: 'e10', title: 'Independence Day Celebration', date: '2026-08-15', time: '8:00 AM – 10:30 AM', location: 'School Ground', category: 'National', image: IMG.celebration, description: 'Flag hoisting by the Chief Guest, march past by the four houses and a patriotic cultural programme.' },
  { id: 'e11', title: 'Investiture Ceremony 2026–27', date: '2026-07-11', time: '10:00 AM – 12:00 PM', location: 'Auditorium', category: 'Academic', image: IMG.graduation, description: 'The new student council and house captains took their oath of office.' },
];

export const announcements = [
  { id: 'a1', title: `Admissions open for ${SCHOOL.admissionYear}`, body: 'Applications are now open for Nursery to Grade IX and Grade XI. Campus tours every Saturday, 9:30 AM – 12:30 PM.', date: '2026-10-01', category: 'Admissions', pinned: true },
  { id: 'a2', title: 'Dussehra holidays: 17 – 25 October', body: 'School will remain closed for Dussehra from 17 to 25 October 2026. Classes resume on Monday, 26 October.', date: '2026-09-29', category: 'Holiday', pinned: false },
  { id: 'a3', title: 'Half-Yearly results published', body: 'Results for Grades I – XII are available in the parent portal. Report cards will be handed over at the PTM on 24 October.', date: '2026-09-28', category: 'Examination', pinned: false },
  { id: 'a4', title: 'Kleos students win at Hyderabad Inter-School Chess', body: 'Congratulations to Sathvik Reddy (VIII-A) and Navya Sharma (VI-B) for securing 1st and 3rd places in the U-14 category.', date: '2026-09-22', category: 'Achievement', pinned: false },
  { id: 'a5', title: 'Parent–Teacher Meeting on 24 October', body: 'PTM for all classes will be held on Saturday, 24 October. Slot booking opens in the parent app on 20 October.', date: '2026-09-20', category: 'Parents', pinned: false },
  { id: 'a6', title: 'Unit Test II schedule released', body: 'Unit Test II for Grades III – XII will be held from 9 to 14 November. The detailed timetable is available under Downloads.', date: '2026-09-18', category: 'Examination', pinned: false },
];

export const galleryCategories = ['Campus', 'Events', 'Sports', 'Cultural', 'Classroom', 'Celebrations'];

export const gallery = [
  { id: 'g1', title: 'A typical Kleos classroom', category: 'Campus', image: IMG.campus },
  { id: 'g2', title: 'Interactive smart classroom', category: 'Classroom', image: IMG.smartClass },
  { id: 'g3', title: 'Annual Sports Day relay', category: 'Sports', image: IMG.sports },
  { id: 'g4', title: 'Annual Day stage performance', category: 'Cultural', image: IMG.dance },
  { id: 'g5', title: 'Pre-primary activity room', category: 'Classroom', image: IMG.kidsClass },
  { id: 'g6', title: 'Library reading hour', category: 'Campus', image: IMG.library },
  { id: 'g7', title: 'Children’s Day celebration', category: 'Celebrations', image: IMG.celebration },
  { id: 'g8', title: 'Science exhibition models', category: 'Events', image: IMG.scienceLab },
  { id: 'g9', title: 'Football practice', category: 'Sports', image: IMG.football },
  { id: 'g10', title: 'School choir rehearsal', category: 'Cultural', image: IMG.music },
  { id: 'g11', title: 'Art studio exhibition', category: 'Events', image: IMG.art },
  { id: 'g12', title: 'Graduation ceremony, Class of 2026', category: 'Celebrations', image: IMG.graduation },
  { id: 'g13', title: 'Coding club in the computer lab', category: 'Classroom', image: IMG.computerLab },
  { id: 'g14', title: 'Inter-house chess finals', category: 'Sports', image: IMG.chess },
  { id: 'g15', title: 'Morning yoga session', category: 'Campus', image: IMG.yoga },
  { id: 'g16', title: 'Annual Day stage', category: 'Events', image: IMG.stage },
];

export const testimonials = [
  { name: 'Srinivas Reddy', role: 'Parent of Aarav, Grade VI', quote: 'What stands out is how well the teachers know our son. We get specific feedback — not just marks — and the transformation in his confidence over two years has been remarkable.' },
  { name: 'Madhavi Sharma', role: 'Parent of Navya, Grade VI & Ishaan, UKG', quote: 'Both my children are at Kleos and they genuinely look forward to school. The pre-primary team is warm and patient, and the communication through the app is excellent.' },
  { name: 'Harshitha Varma', role: 'Student, Grade XII (BiPC)', quote: 'The teachers here make time for doubts even after class. Integrated NEET preparation on campus saves me hours of travel every day.' },
  { name: 'Venkatesh Naidu', role: 'Parent of Sahithi, Grade IX', quote: 'Safety was our first concern when choosing a school. The GPS-enabled buses, lady attendants and strict entry protocols give us real peace of mind.' },
];

export const timeline = [
  { year: '2014', title: 'Founded in Miyapur', text: 'Kleos opens its doors with pre-primary and primary classes and 180 students.' },
  { year: '2016', title: 'CBSE Affiliation', text: 'Receives CBSE affiliation and expands to middle school.' },
  { year: '2018', title: 'New Academic Block', text: 'Five-storey academic block with science labs, library and smart classrooms is inaugurated.' },
  { year: '2020', title: 'Seamless Digital Learning', text: 'Moves to live online classes within a week of lockdown, with zero loss of academic days.' },
  { year: '2022', title: 'Senior Secondary', text: 'Introduces Grades XI–XII with MPC, BiPC and Commerce streams.' },
  { year: '2024', title: 'First Board Batch', text: 'First Grade XII batch graduates with a 100% pass result.' },
  { year: '2026', title: '1,200+ Learners', text: 'Robotics studio opened; student strength crosses 1,200.' },
];

export const coreValues = [
  { title: 'Curiosity', text: 'We ask questions, test ideas and love learning for its own sake.' },
  { title: 'Integrity', text: 'We are honest, fair and take responsibility for our actions.' },
  { title: 'Respect', text: 'We value every person, culture and opinion in our community.' },
  { title: 'Excellence', text: 'We give our best effort and keep raising our own standards.' },
  { title: 'Compassion', text: 'We care for others and for the world we share.' },
];

export const leadership = [
  { name: 'Mr. K. Ramakrishna Rao', role: 'Chairman', text: 'Educationist and founder, guiding Kleos’ vision since 2014.' },
  { name: 'Mrs. Lakshmi Prasanna', role: 'Principal', text: '22 years in CBSE education; leads academics and school culture.' },
  { name: 'Mr. Suresh Babu', role: 'Vice Principal', text: 'Oversees senior school academics and examinations.' },
  { name: 'Mrs. Deepa Nair', role: 'Head — Pre-Primary', text: 'Montessori-trained early years specialist.' },
];

export const achievements = [
  { value: '100%', label: 'CBSE Class X & XII pass results, 2026' },
  { value: '96.4%', label: 'Highest score, Class XII (BiPC), 2026' },
  { value: '32', label: 'Students above 90% in Class X Boards' },
  { value: '18', label: 'District & state-level sports medals' },
];

export const academicCalendar = [
  { month: 'Jun 2026', items: ['School reopens — 12 June', 'Orientation for parents'] },
  { month: 'Jul 2026', items: ['Investiture Ceremony', 'Unit Test I'] },
  { month: 'Aug 2026', items: ['Independence Day', 'Inter-house quiz'] },
  { month: 'Sep 2026', items: ['Half-Yearly Examinations', 'Teachers’ Day'] },
  { month: 'Oct 2026', items: ['Bathukamma celebrations', 'Dussehra holidays', 'PTM — Term I'] },
  { month: 'Nov 2026', items: ['Unit Test II', 'Science Exhibition', 'Children’s Day'] },
  { month: 'Dec 2026', items: ['Annual Sports Day', 'Pre-Board I (X & XII)'] },
  { month: 'Jan 2027', items: ['Sankranti holidays', 'Annual Day', 'Republic Day'] },
  { month: 'Feb 2027', items: ['CBSE Board Exams begin', 'Pre-Board II'] },
  { month: 'Mar 2027', items: ['Annual Examinations', 'Results & PTM'] },
];
