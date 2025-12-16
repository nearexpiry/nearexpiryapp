-- Seed data for Near Expiry App

-- Insert admin user
-- Email: admin@nearexpiry.com
-- Password: Admin123!
INSERT INTO users (email, password_hash, role, is_active)
VALUES ('admin@nearexpiry.com', '$2b$10$FKZWXneFU9zyffRpZ/907eHWIgRqLX9tUnWYgNSZ2MDqnzOV/00nq', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert predefined categories
INSERT INTO categories (name) VALUES
    ('Bakery'),
    ('Dairy'),
    ('Produce'),
    ('Meat & Seafood'),
    ('Prepared Foods'),
    ('Beverages'),
    ('Frozen Foods'),
    ('Pantry Items')
ON CONFLICT (name) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('commission_percentage', '10')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Display summary
DO $$
DECLARE
    user_count INTEGER;
    category_count INTEGER;
    settings_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users WHERE role = 'admin';
    SELECT COUNT(*) INTO category_count FROM categories;
    SELECT COUNT(*) INTO settings_count FROM settings;

    RAISE NOTICE 'Seed data inserted successfully:';
    RAISE NOTICE '  - Admin users: %', user_count;
    RAISE NOTICE '  - Categories: %', category_count;
    RAISE NOTICE '  - Settings: %', settings_count;
END $$;
