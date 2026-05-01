-- ============================================
-- ProvinceApp — Complete Database Schema
-- Run this ONCE in Supabase SQL Editor
-- supabase.com → your project → SQL Editor → New Query → Paste → Run
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ===== INSTITUTIONS =====
create table if not exists institutions (
  id text primary key,
  name text not null,
  location text,
  active boolean default true,
  created_at timestamptz default now()
);

-- ===== USERS =====
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id) on delete cascade,
  reg_no text unique,
  name text not null,
  email text unique not null,
  password_hash text not null,
  course text,
  year int check (year between 1 and 6),
  role text default 'student', -- student | admin | moderator
  created_at timestamptz default now()
);

-- ===== ANNOUNCEMENTS =====
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id),
  text text not null,
  urgent boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

-- ===== RESTAURANTS =====
create table if not exists restaurants (
  id text primary key,
  inst_id text references institutions(id),
  name text not null,
  tagline text,
  emoji text default '🍽️',
  cover_color text default '#1a1a1a',
  location text,
  open boolean default true,
  open_hours text,
  delivery boolean default false,
  veg boolean default false,
  rating numeric(2,1) default 4.0,
  rating_count int default 0,
  phone text,
  created_at timestamptz default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id text references restaurants(id) on delete cascade,
  category text not null,
  name text not null,
  description text,
  price int not null,
  veg boolean default true,
  popular boolean default false,
  available boolean default true,
  emoji text default '🍛',
  created_at timestamptz default now()
);

-- ===== ORDERS =====
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  restaurant_id text references restaurants(id),
  status text default 'pending', -- pending|confirmed|preparing|ready|delivered|cancelled
  total int not null,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  item_id uuid references menu_items(id),
  name text,
  price int,
  quantity int default 1
);

-- ===== ACADEMICS =====
create table if not exists courses (
  id text primary key,
  inst_id text references institutions(id),
  name text not null,
  short_name text,
  emoji text default '📚',
  color text default '#3B82F6',
  total_semesters int default 8
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  course_id text references courses(id) on delete cascade,
  semester int not null,
  code text not null,
  name text not null,
  credits int default 4,
  type text default 'theory' -- theory | lab
);

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade,
  number int not null,
  title text not null
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  type text not null, -- video | notes | pyq
  title text not null,
  url text,
  file_path text, -- Supabase storage path
  duration_min int, -- for videos
  pages int,       -- for notes/pyq
  year int,        -- for pyqs (exam year)
  uploaded_by uuid references users(id),
  created_at timestamptz default now()
);

-- ===== PG & ROOMS =====
create table if not exists pg_listings (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id),
  name text not null,
  type text not null, -- boys | girls | coed
  location text,
  distance text,
  price int,
  amenities text[] default '{}',
  verified boolean default false,
  rating numeric(2,1) default 4.0,
  phone text,
  images text[] default '{}',
  created_at timestamptz default now()
);

-- ===== CLUBS =====
create table if not exists clubs (
  id text primary key,
  inst_id text references institutions(id),
  name text not null,
  icon text default '🎯',
  category text,
  description text,
  meet_day text,
  location text,
  member_count int default 0,
  active boolean default true
);

create table if not exists club_members (
  club_id text references clubs(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (club_id, user_id)
);

-- ===== CONFESSION WALL =====
create table if not exists confessions (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id),
  text text not null,
  hearts int default 0,
  laughs int default 0,
  created_at timestamptz default now()
);

-- ===== DISCUSSIONS =====
create table if not exists discussions (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id),
  user_id uuid references users(id),
  title text not null,
  body text,
  category text default 'General',
  votes int default 0,
  comments int default 0,
  pinned boolean default false,
  created_at timestamptz default now()
);

-- ===== LOST & FOUND =====
create table if not exists lost_found (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id),
  user_id uuid references users(id),
  type text not null, -- lost | found
  title text not null,
  description text,
  location text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- ===== FEEDBACK =====
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id),
  user_id uuid references users(id),
  category text,
  title text not null,
  description text,
  location text,
  anonymous boolean default false,
  status text default 'open', -- open | in-review | resolved
  created_at timestamptz default now()
);

-- ===== CHAT =====
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  inst_id text references institutions(id),
  user_id uuid references users(id),
  user_name text default 'Anonymous',
  message text not null,
  created_at timestamptz default now()
);

-- ===== MOCK TESTS =====
create table if not exists mock_tests (
  id text primary key,
  inst_id text references institutions(id),
  name text not null,
  subject text,
  course text default 'ALL',
  questions int default 30,
  time_min int default 60,
  difficulty text default 'Medium', -- Easy | Medium | Hard
  attempts int default 0
);

-- ===== FAQs =====
create table if not exists faqs (
  id serial primary key,
  inst_id text references institutions(id),
  category text,
  question text not null,
  answer text not null
);

-- ===== HELPER FUNCTIONS =====

-- Increment club members
create or replace function increment_club_members(club_id text)
returns void as $$
  update clubs set member_count = member_count + 1 where id = club_id;
$$ language sql;

-- Increment confession reaction
create or replace function increment_reaction(row_id uuid, col_name text)
returns void as $$
begin
  if col_name = 'hearts' then
    update confessions set hearts = hearts + 1 where id = row_id;
  else
    update confessions set laughs = laughs + 1 where id = row_id;
  end if;
end;
$$ language plpgsql;

-- Vote on discussion
create or replace function vote_discussion(disc_id uuid, delta int)
returns void as $$
  update discussions set votes = votes + delta where id = disc_id;
$$ language sql;

-- ===== ROW LEVEL SECURITY =====
alter table users enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Users can only see their own data
create policy "Users see own profile" on users for select using (auth.uid()::text = id::text);
create policy "Users see own orders" on orders for select using (auth.uid()::text = user_id::text);

-- Public read for community tables
create policy "Public confessions" on confessions for select using (true);
create policy "Public discussions" on discussions for select using (true);
create policy "Public lost_found" on lost_found for select using (true);
create policy "Public restaurants" on restaurants for select using (true);
create policy "Public menu" on menu_items for select using (true);
create policy "Public clubs" on clubs for select using (true);
create policy "Public pg" on pg_listings for select using (true);
create policy "Public faqs" on faqs for select using (true);
create policy "Public announcements" on announcements for select using (true);
create policy "Public chat" on chat_messages for select using (true);
create policy "Public courses" on courses for select using (true);
create policy "Public subjects" on subjects for select using (true);
create policy "Public chapters" on chapters for select using (true);
create policy "Public resources" on resources for select using (true);
create policy "Public mock tests" on mock_tests for select using (true);

-- ===== SEED: LPU INSTITUTION =====
insert into institutions (id, name, location) values 
('lpu', 'Lovely Professional University', 'Phagwara, Punjab')
on conflict (id) do nothing;

-- ===== SEED: LPU ANNOUNCEMENTS =====
insert into announcements (inst_id, text, urgent) values
('lpu', '📅 Mid-term exams start Nov 18', false),
('lpu', '📝 Sem registration deadline: Dec 5', false),
('lpu', '🏢 HCL Technologies campus drive — Dec 2', true),
('lpu', '🍽️ New mess menu updated for December', false),
('lpu', '📚 Fresh PYQs added for CSE 2024 batch', false),
('lpu', '💰 Hostel fee due Dec 15', true),
('lpu', '🎉 Career fair Nov 25 at Block 38', false),
('lpu', '🌐 UMS maintenance: Dec 10, 2–4 AM', false);

-- ===== SEED: LPU FAQs =====
insert into faqs (inst_id, category, question, answer) values
('lpu', 'Exams', 'What is the passing criteria in LPU?', 'Students must score minimum 40% (Grade D or above) in each subject. Practical/lab subjects require 50% minimum. CGPA must stay above 4.0 to avoid academic probation.'),
('lpu', 'Exams', 'How many chances for re-appearing in exams?', 'Maximum 2 re-appear chances for theory subjects. Only 1 re-appear for practicals. Re-appear fees apply from the second attempt.'),
('lpu', 'Grades', 'What is the grading system at LPU?', '10-point CGPA scale: O=10, A+=9, A=8, B+=7, B=6, C=5, D=4 (Pass), F=0 (Fail). SGPA calculated each semester.'),
('lpu', 'Attendance', 'What is the minimum attendance required?', '75% attendance minimum to appear in end-term exams. Medical leave requires documentation within 3 working days.'),
('lpu', 'Exams', 'What is the exam pattern for BTech?', 'Mid-term: 20 marks. End-term: 80 marks. Internal assessment contributes 30% through assignments, quizzes, and class participation.'),
('lpu', 'UMS', 'How do I check my UMS results?', 'Login to ums.lpu.in → Academic Reports → Semester Results. Published within 15 working days after exams.'),
('lpu', 'Fees', 'What is the fee payment deadline?', 'July 15 (odd semester) and January 15 (even semester). Late payment: ₹500/day penalty.'),
('lpu', 'Hostel', 'What are hostel curfew timings?', 'Boys: 11 PM. Girls: 9 PM. Entry/exit logged via biometric.');

-- ===== SEED: LPU RESTAURANTS =====
insert into restaurants (id, inst_id, name, tagline, emoji, location, open, delivery, veg, rating, rating_count, phone) values
('punjabi-dhaba', 'lpu', 'Punjabi Dhaba', 'Real Punjabi food, real fast', '🍛', 'Block 34, Ground Floor', true, true, false, 4.3, 892, '98765-43210'),
('pizza-point', 'lpu', 'Pizza Point', 'Crispy, cheesy, no excuses', '🍕', 'Main Market, Block 38', true, true, false, 4.1, 534, '98765-11122'),
('south-bites', 'lpu', 'South Bites', 'Authentic south, every bite', '🥞', 'Block 32 Food Court', true, true, true, 4.5, 1243, '98765-33344'),
('campus-cafe', 'lpu', 'Campus Café', 'Fuel for your next all-nighter', '☕', 'Library Block, Ground Floor', true, false, true, 4.2, 678, '98765-55566'),
('chole-king', 'lpu', 'Chole Bhature King', 'Gate 2 legend since 2009', '🫓', 'Law Gate, Opposite Gate 2', true, false, true, 4.7, 2341, '98765-77788');

-- ===== SEED: LPU COURSES =====
insert into courses (id, inst_id, name, short_name, emoji, color) values
('cse', 'lpu', 'B.Tech Computer Science Engineering', 'BTech CSE', '💻', '#3B82F6'),
('mba', 'lpu', 'Master of Business Administration', 'MBA', '📊', '#A855F7'),
('agriculture', 'lpu', 'B.Sc Agriculture', 'BSc Agriculture', '🌾', '#22C55E'),
('bca', 'lpu', 'Bachelor of Computer Applications', 'BCA', '🖥️', '#F59E0B'),
('bcom', 'lpu', 'Bachelor of Commerce', 'BCom', '💰', '#EF4444');

-- ===== SEED: LPU CLUBS =====
insert into clubs (id, inst_id, name, icon, category, description, meet_day, location, member_count) values
('cp', 'lpu', 'CodeForces Club', '💻', 'Tech', 'Competitive programming — LeetCode, Codeforces, CodeChef weekly contests', 'Every Saturday, 7 PM', 'Block 37, Lab 4', 1240),
('ff', 'lpu', 'Free Fire Esports', '🎮', 'Gaming', 'Official LPU team — ranked scrims, tournaments, IGL coaching', 'Daily, 8–10 PM', 'E-Sports Arena, Block 56', 890),
('robotics', 'lpu', 'Robotics Club', '🤖', 'Tech', 'Robocon, drone racing, IoT projects, smart campus builds', 'Wed & Fri, 4 PM', 'Robotics Lab, Block 38', 560),
('startup', 'lpu', 'Startup Hub', '🚀', 'Business', 'Pitching, startup validation, networking with investors', 'Wednesdays, 6 PM', 'Innovation Centre, Block 40', 530),
('sports', 'lpu', 'Sports Council', '⚽', 'Sports', 'Football, cricket, badminton, athletics — inter-university teams', 'Daily, 5:30 AM & 4 PM', 'Sports Complex', 1500);

-- ===== SEED: LPU PG LISTINGS =====
insert into pg_listings (inst_id, name, type, location, distance, price, amenities, verified, rating) values
('lpu', 'Sunrise Boys PG', 'boys', 'Law Gate, Phagwara', '500m from Main Gate', 5500, ARRAY['WiFi','Meals (3x)','Laundry','24x7 Security','Hot Water'], true, 4.2),
('lpu', 'Green Valley Girls Hostel', 'girls', 'Near Block 32 Gate', '800m from campus', 7000, ARRAY['WiFi','AC Room','Meals (3x)','Lady Security','Study Room'], true, 4.5),
('lpu', 'Shubham Residency', 'coed', 'Phagwara City Centre', '2km from LPU', 4200, ARRAY['WiFi','Shared Kitchen','Common Room','RO Water'], false, 3.8),
('lpu', 'LPU Official Boys Hostel', 'boys', 'On Campus, Block 55', 'On campus', 9500, ARRAY['WiFi','Meals (3x)','Gym','Laundry','Medical'], true, 4.0),
('lpu', 'Metro PG Phagwara', 'boys', 'GT Road, Phagwara', '1.2km', 4800, ARRAY['WiFi','Meals (2x)','Laundry'], false, 3.9),
('lpu', 'Rajan''s Girls PG', 'girls', 'Near Gate 3', '600m', 6000, ARRAY['WiFi','Meals (2x)','Security','Study Room','CCTV'], true, 4.3);

-- ===== SEED: MOCK TESTS =====
insert into mock_tests (id, inst_id, name, subject, course, questions, time_min, difficulty, attempts) values
('t1', 'lpu', 'DSA Practice Set 1', 'Data Structures & Algorithms', 'CSE', 30, 60, 'Medium', 2341),
('t2', 'lpu', 'OS Mid-Term Mock', 'Operating Systems', 'CSE', 25, 45, 'Hard', 1890),
('t3', 'lpu', 'DBMS Full Mock', 'Database Management Systems', 'CSE', 40, 90, 'Medium', 3120),
('t4', 'lpu', 'Aptitude + Reasoning Sprint', 'Placement Prep', 'ALL', 50, 60, 'Easy', 5670),
('t5', 'lpu', 'Full Semester 3 Mock', 'All Sem 3 Subjects', 'CSE', 100, 180, 'Hard', 4320),
('t6', 'lpu', 'Java OOP Concepts Test', 'OOP with Java', 'CSE', 25, 40, 'Medium', 1560),
('t7', 'lpu', 'Financial Accounting Quiz', 'Financial Accounting', 'MBA', 30, 45, 'Medium', 678);
