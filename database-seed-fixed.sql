-- Insert sample data with proper UUIDs

-- First, let's check if data already exists and clear it
TRUNCATE TABLE "Notification" CASCADE;
TRUNCATE TABLE "Progress" CASCADE;
TRUNCATE TABLE "Enrollment" CASCADE;
TRUNCATE TABLE "TestResponse" CASCADE;
TRUNCATE TABLE "TestAttempt" CASCADE;
TRUNCATE TABLE "Question" CASCADE;
TRUNCATE TABLE "Test" CASCADE;
TRUNCATE TABLE "Lesson" CASCADE;
TRUNCATE TABLE "Module" CASCADE;
TRUNCATE TABLE "Subject" CASCADE;
TRUNCATE TABLE "Payment" CASCADE;
TRUNCATE TABLE "Subscription" CASCADE;
TRUNCATE TABLE "UserProfile" CASCADE;
TRUNCATE TABLE "VerificationToken" CASCADE;
TRUNCATE TABLE "Session" CASCADE;
TRUNCATE TABLE "Account" CASCADE;
TRUNCATE TABLE "User" CASCADE;

-- Insert admin user (password: admin123)
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'admin@communityias.com', '$2a$10$qV2QlPxuJWXX5EyF8M4HFOxQPJbumJXqC8EhKwqKL9VVYfJNsWBim', 'Admin User', 'ADMIN', NOW(), NOW());

-- Insert test student (password: student123)
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'student@example.com', '$2a$10$YlJ1Y0yBxPa9QzO.BmWgC.Es2EBHlFqT0M4z6H1GhQiLnIkVVVtOi', 'Test Student', 'STUDENT', NOW(), NOW());

-- Insert user profiles
INSERT INTO "UserProfile" (id, userId, phone, city, state, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '9876543210', 'Delhi', 'Delhi', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '9876543211', 'Mumbai', 'Maharashtra', NOW(), NOW());

-- Insert subjects
INSERT INTO "Subject" (id, name, description, icon, color, "order", "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440101', 'History', 'Indian History from Ancient to Modern times', 'BookOpen', '#8B5CF6', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', 'Geography', 'Physical, Human and Economic Geography', 'Globe', '#10B981', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', 'Polity', 'Indian Constitution, Governance and Politics', 'Scale', '#3B82F6', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', 'Economics', 'Indian Economy and Economic Development', 'TrendingUp', '#F59E0B', 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', 'Current Affairs', 'Daily news and contemporary issues', 'Newspaper', '#EF4444', 5, NOW(), NOW());

-- Insert modules
INSERT INTO "Module" (id, subjectId, name, description, "order", "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440103', 'Constitutional Basics', 'Fundamental concepts of Indian Constitution', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440103', 'Fundamental Rights & Duties', 'Rights and duties of Indian citizens', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', 'Ancient India', 'From Indus Valley to Gupta Period', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440101', 'Medieval India', 'Delhi Sultanate to Mughal Empire', 2, NOW(), NOW());

-- Insert lessons
INSERT INTO "Lesson" (id, moduleId, title, description, content, duration, difficulty, "order", "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440202', 'Fundamental Rights', 'Understanding the six fundamental rights', 'Detailed content about fundamental rights...', 45, 'MEDIUM', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440202', 'Fundamental Duties', 'Understanding citizen duties', 'Detailed content about fundamental duties...', 30, 'EASY', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440201', 'Directive Principles', 'DPSP and their significance', 'Content about DPSP...', 40, 'MEDIUM', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440201', 'Preamble', 'Understanding the Preamble', 'Content about Preamble...', 25, 'EASY', 2, NOW(), NOW());

-- Insert test
INSERT INTO "Test" (id, title, description, subjectId, type, duration, totalMarks, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440401', 'Fundamental Rights Quiz', 'Test your knowledge on Fundamental Rights', '550e8400-e29b-41d4-a716-446655440103', 'PRACTICE', 20, 20, NOW(), NOW());

-- Insert questions
INSERT INTO "Question" (id, testId, type, question, options, correctAnswer, explanation, marks, "order", "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440401', 'MCQ', 'Which article of the Indian Constitution deals with the Right to Equality?', 
'["Article 14-18", "Article 19-22", "Article 23-24", "Article 25-28"]'::jsonb, 
'Article 14-18', 'Articles 14-18 deal with the Right to Equality', 1, 1, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440401', 'MCQ', 'How many fundamental rights are guaranteed by the Indian Constitution?', 
'["5", "6", "7", "8"]'::jsonb, 
'6', 'There are 6 fundamental rights in the Indian Constitution', 1, 2, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440401', 'MCQ', 'Which fundamental right was removed by the 44th Constitutional Amendment?', 
'["Right to Education", "Right to Property", "Right to Privacy", "Right to Work"]'::jsonb, 
'Right to Property', 'The Right to Property was removed as a fundamental right by the 44th Amendment', 1, 3, NOW(), NOW());

-- Insert enrollments
INSERT INTO "Enrollment" (id, userId, subjectId, progress, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440103', 25, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440101', 10, NOW(), NOW());

-- Insert subscriptions
INSERT INTO "Subscription" (id, userId, plan, status, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440001', 'PREMIUM_PLUS', 'ACTIVE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440002', 'FREE', 'ACTIVE', NOW(), NOW());

-- Insert notifications
INSERT INTO "Notification" (id, userId, title, message, type, "createdAt") VALUES 
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440002', 'Welcome to Community IAS!', 'Start your UPSC preparation journey with our comprehensive courses.', 'INFO', NOW()),
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440002', 'New Feature Available', 'Check out our new interactive lessons in Polity!', 'SUCCESS', NOW());

-- Verify the data was inserted
SELECT 'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Subjects', COUNT(*) FROM "Subject"
UNION ALL
SELECT 'Modules', COUNT(*) FROM "Module"
UNION ALL
SELECT 'Lessons', COUNT(*) FROM "Lesson"
UNION ALL
SELECT 'Tests', COUNT(*) FROM "Test"
UNION ALL
SELECT 'Questions', COUNT(*) FROM "Question";