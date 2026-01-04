-- Migration: 002_init_data
-- This file mirrors init_data.sql

-- Sample seed data for Taobao-style e-commerce schema

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO users (id, username, email, password_hash, phone, real_name, avatar_url, is_active)
VALUES
  (1, 'alice', 'alice@example.com', '$2b$10$g8j9qP7mE4Q1c2W8m1gK4uQ0oXgU7jLkY7b5m0B2Jr7jBv4G2eO0K', '13800000001', 'Alice Zhang', 'https://example.com/avatar/alice.png', 1),
  (2, 'bob', 'bob@example.com', '$2b$10$5lqH2YzQbGmO2HcJm4qkseR7l5l7v1wEo2e8E6o9Yt3b7jT8b3a1S', '13800000002', 'Bob Li', 'https://example.com/avatar/bob.png', 1);

INSERT INTO addresses (id, user_id, province, city, district, detail_address, recipient_name, recipient_phone, is_default)
VALUES
  (1, 1, '浙江省', '杭州市', '西湖区', '文三路 123 号 5F', 'Alice Zhang', '13800000001', 1),
  (2, 2, '上海市', '上海市', '浦东新区', '世纪大道 1000 号', 'Bob Li', '13800000002', 1);

INSERT INTO categories (id, name, description, parent_id, icon_url, sort_order, is_active)
VALUES
  (1, '电子产品', '数码与电子商品', NULL, 'https://example.com/icons/electronics.png', 1, 1),
  (2, '手机', '智能手机与配件', 1, 'https://example.com/icons/phone.png', 10, 1),
  (3, '电脑办公', '电脑/外设/办公用品', 1, 'https://example.com/icons/pc.png', 20, 1),
  (4, '服饰', '服装鞋帽箱包', NULL, 'https://example.com/icons/clothes.png', 2, 1),
  (5, '男装', '男士服装', 4, 'https://example.com/icons/men.png', 10, 1),
  (6, '女装', '女士服装', 4, 'https://example.com/icons/women.png', 20, 1);

INSERT INTO products (
  id, name, description, category_id, price, original_price, stock_quantity,
  image_url, images, sales_count, rating, is_active
)
VALUES
  (
    1,
    'iPhone 15 128GB',
    'A16 芯片，支持 5G，官方原装正品。',
    2,
    5999.00,
    6999.00,
    100,
    'https://example.com/products/iphone15/main.jpg',
    JSON_ARRAY(
      'https://example.com/products/iphone15/1.jpg',
      'https://example.com/products/iphone15/2.jpg',
      'https://example.com/products/iphone15/3.jpg'
    ),
    523,
    4.80,
    1
  ),
  (
    2,
    '机械键盘 87 键 红轴',
    'PBT 键帽，热插拔，白色背光。',
    3,
    299.00,
    399.00,
    300,
    'https://example.com/products/keyboard/main.jpg',
    JSON_ARRAY(
      'https://example.com/products/keyboard/1.jpg',
      'https://example.com/products/keyboard/2.jpg'
    ),
    1087,
    4.65,
    1
  ),
  (
    3,
    '男士连帽卫衣',
    '春秋款，舒适棉质，经典百搭。',
    5,
    99.00,
    129.00,
    500,
    'https://example.com/products/hoodie/main.jpg',
    JSON_ARRAY(
      'https://example.com/products/hoodie/1.jpg'
    ),
    2034,
    4.50,
    1
  );

INSERT INTO cart_items (id, user_id, product_id, quantity)
VALUES
  (1, 1, 3, 2),
  (2, 2, 2, 1);

INSERT INTO orders (
  id, order_number, user_id, total_price, status, payment_method, shipping_address, notes,
  created_at, paid_at
)
VALUES
  (
    1,
    'TB202601040001',
    1,
    299.00,
    'paid',
    'alipay',
    '浙江省杭州市西湖区 文三路 123 号 5F，收件人：Alice Zhang，电话：13800000001',
    '请尽快发货，谢谢。',
    NOW(),
    NOW()
  );

INSERT INTO order_items (id, order_id, product_id, product_name, unit_price, quantity, subtotal)
VALUES
  (1, 1, 2, '机械键盘 87 键 红轴', 299.00, 1, 299.00);

INSERT INTO payments (id, order_id, amount, payment_method, transaction_id, status)
VALUES
  (1, 1, 299.00, 'alipay', 'ALI202601040001', 'success');

INSERT INTO reviews (id, order_id, product_id, user_id, rating, content)
VALUES
  (1, 1, 2, 1, 5, '手感很好，性价比高，物流也很快！');
