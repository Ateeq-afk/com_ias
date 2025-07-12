-- Simple seed data - run each section separately if needed

-- Step 1: Insert Users
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'admin@communityias.com', '$2a$10$qV2QlPxuJWXX5EyF8M4HFOxQPJbumJXqC8EhKwqKL9VVYfJNsWBim', 'Admin User', 'ADMIN', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'student@example.com', '$2a$10$YlJ1Y0yBxPa9QzO.BmWgC.Es2EBHlFqT0M4z6H1GhQiLnIkVVVtOi', 'Test Student', 'STUDENT', NOW(), NOW());

-- Step 2: Insert User Profiles (note the capital U in userId)
INSERT INTO "UserProfile" (id, "userId", phone, city, state, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '9876543210', 'Delhi', 'Delhi', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '9876543211', 'Mumbai', 'Maharashtra', NOW(), NOW());

-- Step 3: Insert Subjects
INSERT INTO "Subject" (id, name, description, icon, color, "order", "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440101', 'History', 'Indian History from Ancient to Modern times', 'BookOpen', '#8B5CF6', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', 'Geography', 'Physical, Human and Economic Geography', 'Globe', '#10B981', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', 'Polity', 'Indian Constitution, Governance and Politics', 'Scale', '#3B82F6', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', 'Economics', 'Indian Economy and Economic Development', 'TrendingUp', '#F59E0B', 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', 'Current Affairs', 'Daily news and contemporary issues', 'Newspaper', '#EF4444', 5, NOW(), NOW());

-- Step 4: Insert Modules (note the capital I in subjectId)
INSERT INTO "Module" (id, "subjectId", name, description, "order", "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440103', 'Constitutional Basics', 'Fundamental concepts of Indian Constitution', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440103', 'Fundamental Rights & Duties', 'Rights and duties of Indian citizens', 2, NOW(), NOW());

-- Step 5: Insert Lessons (note the capital I in moduleId)
INSERT INTO "Lesson" (id, "moduleId", title, description, content, duration, difficulty, "order", "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440202', 'Fundamental Rights', 'Understanding the six fundamental rights', 'Detailed content about fundamental rights...', 45, 'MEDIUM', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440202', 'Fundamental Duties', 'Understanding citizen duties', 'Detailed content about fundamental duties...', 30, 'EASY', 2, NOW(), NOW());

-- Step 6: Insert Subscriptions (note the capital I in userId)
INSERT INTO "Subscription" (id, "userId", plan, status, "createdAt", "updatedAt") VALUES 
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440001', 'PREMIUM_PLUS', 'ACTIVE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440002', 'FREE', 'ACTIVE', NOW(), NOW());

-- Check if data was inserted
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as subject_count FROM "Subject";
SELECT COUNT(*) as module_count FROM "Module";
SELECT COUNT(*) as lesson_count FROM "Lesson";