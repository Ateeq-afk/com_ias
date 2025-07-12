-- Insert sample data

-- Insert admin user (password: admin123 - bcrypt hashed)
INSERT INTO "User" (id, email, password, name, role) VALUES 
('admin-user-id', 'admin@communityias.com', '$2a$10$qV2QlPxuJWXX5EyF8M4HFOxQPJbumJXqC8EhKwqKL9VVYfJNsWBim', 'Admin User', 'ADMIN');

-- Insert test student (password: student123 - bcrypt hashed)
INSERT INTO "User" (id, email, password, name, role) VALUES 
('student-user-id', 'student@example.com', '$2a$10$YlJ1Y0yBxPa9QzO.BmWgC.Es2EBHlFqT0M4z6H1GhQiLnIkVVVtOi', 'Test Student', 'STUDENT');

-- Insert user profiles
INSERT INTO "UserProfile" (userId, phone, city, state) VALUES 
('admin-user-id', '9876543210', 'Delhi', 'Delhi'),
('student-user-id', '9876543211', 'Mumbai', 'Maharashtra');

-- Insert subjects
INSERT INTO "Subject" (id, name, description, icon, color, "order") VALUES 
('history-id', 'History', 'Indian History from Ancient to Modern times', 'BookOpen', '#8B5CF6', 1),
('geography-id', 'Geography', 'Physical, Human and Economic Geography', 'Globe', '#10B981', 2),
('polity-id', 'Polity', 'Indian Constitution, Governance and Politics', 'Scale', '#3B82F6', 3),
('economics-id', 'Economics', 'Indian Economy and Economic Development', 'TrendingUp', '#F59E0B', 4),
('current-affairs-id', 'Current Affairs', 'Daily news and contemporary issues', 'Newspaper', '#EF4444', 5);

-- Insert modules
INSERT INTO "Module" (id, subjectId, name, description, "order") VALUES 
('polity-basics-id', 'polity-id', 'Constitutional Basics', 'Fundamental concepts of Indian Constitution', 1),
('polity-rights-id', 'polity-id', 'Fundamental Rights & Duties', 'Rights and duties of Indian citizens', 2),
('history-ancient-id', 'history-id', 'Ancient India', 'From Indus Valley to Gupta Period', 1),
('history-medieval-id', 'history-id', 'Medieval India', 'Delhi Sultanate to Mughal Empire', 2);

-- Insert lessons
INSERT INTO "Lesson" (id, moduleId, title, description, content, duration, difficulty) VALUES 
('lesson-fr-id', 'polity-rights-id', 'Fundamental Rights', 'Understanding the six fundamental rights', 'Detailed content about fundamental rights...', 45, 'MEDIUM'),
('lesson-fd-id', 'polity-rights-id', 'Fundamental Duties', 'Understanding citizen duties', 'Detailed content about fundamental duties...', 30, 'EASY'),
('lesson-dpsp-id', 'polity-basics-id', 'Directive Principles', 'DPSP and their significance', 'Content about DPSP...', 40, 'MEDIUM'),
('lesson-preamble-id', 'polity-basics-id', 'Preamble', 'Understanding the Preamble', 'Content about Preamble...', 25, 'EASY');

-- Insert test
INSERT INTO "Test" (id, title, description, subjectId, type, duration, totalMarks) VALUES 
('test-polity-fr-id', 'Fundamental Rights Quiz', 'Test your knowledge on Fundamental Rights', 'polity-id', 'PRACTICE', 20, 20);

-- Insert questions
INSERT INTO "Question" (testId, type, question, options, correctAnswer, explanation, marks, "order") VALUES 
('test-polity-fr-id', 'MCQ', 'Which article of the Indian Constitution deals with the Right to Equality?', 
'["Article 14-18", "Article 19-22", "Article 23-24", "Article 25-28"]'::jsonb, 
'Article 14-18', 'Articles 14-18 deal with the Right to Equality', 1, 1),

('test-polity-fr-id', 'MCQ', 'How many fundamental rights are guaranteed by the Indian Constitution?', 
'["5", "6", "7", "8"]'::jsonb, 
'6', 'There are 6 fundamental rights in the Indian Constitution', 1, 2),

('test-polity-fr-id', 'MCQ', 'Which fundamental right was removed by the 44th Constitutional Amendment?', 
'["Right to Education", "Right to Property", "Right to Privacy", "Right to Work"]'::jsonb, 
'Right to Property', 'The Right to Property was removed as a fundamental right by the 44th Amendment', 1, 3);

-- Insert enrollments
INSERT INTO "Enrollment" (userId, subjectId, progress) VALUES 
('student-user-id', 'polity-id', 25),
('student-user-id', 'history-id', 10);

-- Insert subscriptions
INSERT INTO "Subscription" (userId, plan, status) VALUES 
('admin-user-id', 'PREMIUM_PLUS', 'ACTIVE'),
('student-user-id', 'FREE', 'ACTIVE');

-- Insert notifications
INSERT INTO "Notification" (userId, title, message, type) VALUES 
('student-user-id', 'Welcome to Community IAS!', 'Start your UPSC preparation journey with our comprehensive courses.', 'INFO'),
('student-user-id', 'New Feature Available', 'Check out our new interactive lessons in Polity!', 'SUCCESS');