
-- 1. Bảng USERS
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'MEMBER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- 2. Bảng CLASSES
CREATE TABLE classes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    mentor_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_classes_mentor FOREIGN KEY (mentor_id) 
        REFERENCES users(id) ON DELETE RESTRICT
);

-- 3. Bảng CLASS_MEMBERS (Liên kết Member - Class)
CREATE TABLE class_members (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_member UNIQUE (class_id, member_id),
    CONSTRAINT fk_cm_class FOREIGN KEY (class_id) 
        REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_member FOREIGN KEY (member_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Bảng LESSONS
CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_lesson_order UNIQUE (class_id, order_index),
    CONSTRAINT fk_lessons_class FOREIGN KEY (class_id) 
        REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_lessons_creator FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE RESTRICT
);

-- 5. Bảng LESSON_PROGRESS (Ghi nhận hoàn thành bài học)
CREATE TABLE lesson_progress (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_lesson_member_progress UNIQUE (lesson_id, member_id),
    CONSTRAINT fk_lp_lesson FOREIGN KEY (lesson_id) 
        REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT fk_lp_member FOREIGN KEY (member_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Bảng ASSIGNMENTS
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    maximum_score DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignments_class FOREIGN KEY (class_id) 
        REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignments_creator FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE RESTRICT
);

-- 7. Bảng SUBMISSIONS
CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    content TEXT,
    repository_url VARCHAR(500) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2) NULL,
    feedback TEXT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT uq_assignment_member_submission UNIQUE (assignment_id, member_id),
    CONSTRAINT fk_submissions_assignment FOREIGN KEY (assignment_id) 
        REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_submissions_member FOREIGN KEY (member_id) 
        REFERENCES users(id) ON DELETE CASCADE
);



-- Tối ưu lấy danh sách lớp của một Member
CREATE INDEX idx_class_members_member_id ON class_members(member_id);

-- Tối ưu kiểm tra các lớp do Mentor phụ trách
CREATE INDEX idx_classes_mentor_id ON classes(mentor_id);

-- Tối ưu lấy toàn bộ bài học theo lớp và sắp xếp theo thứ tự
CREATE INDEX idx_lessons_class_id ON lessons(class_id);

-- Tối ưu API GET /classes/:id/progress: kiểm tra số bài đã hoàn thành của một Member
CREATE INDEX idx_lp_member_lesson ON lesson_progress(member_id, lesson_id);
CREATE INDEX idx_lp_lesson_id ON lesson_progress(lesson_id);

-- Tối ưu lấy toàn bộ bài nộp của một Assignment cho Mentor chấm điểm
CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_member_id ON submissions(member_id);

