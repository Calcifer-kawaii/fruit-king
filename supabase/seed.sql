-- 果物キング — Development seed data
-- ⚠️  LOCAL DEV ONLY. Do not run in production.
-- This file inserts sample profiles, listings, images, and inquiries.
-- It assumes you already have the corresponding rows in auth.users (e.g.,
-- after signing in once with Google). Replace the UUIDs below with the real
-- ids from `select id, email from auth.users;` before running.

-- ---- 1. Profiles --------------------------------------------------------
-- Replace these UUIDs with real auth.users.id values from your project.
insert into public.profiles (id, email, display_name, username, bio, preferred_language, is_admin)
values
  ('00000000-0000-0000-0000-000000000001', 'aoi@example.com',  '青森フルーツ農園', 'aomori-farm',  '青森でりんごとさくらんぼを育てています。',          'ja', false),
  ('00000000-0000-0000-0000-000000000002', 'mika@example.com', 'みかん畑のミカ',     'mika-mikan',   '愛媛のみかんを直送しています。',                   'ja', false),
  ('00000000-0000-0000-0000-000000000003', 'kaito@example.com','南国フルーツ便',     'kaito-tropics','沖縄からマンゴー・パイナップルをお届けします。',   'ja', false)
on conflict (id) do update
  set display_name = excluded.display_name,
      username = excluded.username,
      bio = excluded.bio;

-- ---- 2. Listings --------------------------------------------------------
insert into public.listings (id, seller_id, title, fruit_type, price, currency, description, stock, prefecture, status)
values
  ('11111111-1111-1111-1111-111111111101', '00000000-0000-0000-0000-000000000001',
   '青森県産 ふじりんご 5kg 贈答用', 'apple', 4800, 'JPY',
   '甘みと酸味のバランスが絶妙な、青森県産のふじりんご。家族でじっくり育てました。', 12, '青森県', 'active'),
  ('11111111-1111-1111-1111-111111111102', '00000000-0000-0000-0000-000000000001',
   '佐藤錦 さくらんぼ 500g 化粧箱', 'berry', 5400, 'JPY',
   '山形の名品、佐藤錦。粒が大きく、瑞々しい一品です。', 6, '山形県', 'active'),
  ('11111111-1111-1111-1111-111111111103', '00000000-0000-0000-0000-000000000002',
   '愛媛県産 温州みかん 3kg', 'citrus', 2800, 'JPY',
   '皮が薄く、ジューシーで甘い愛媛の温州みかんです。', 30, '愛媛県', 'active'),
  ('11111111-1111-1111-1111-111111111104', '00000000-0000-0000-0000-000000000003',
   '沖縄県産 完熟マンゴー 2玉', 'mango', 5800, 'JPY',
   '完熟させてから収穫した、とろける甘さのマンゴーです。', 8, '沖縄県', 'active'),
  ('11111111-1111-1111-1111-111111111105', '00000000-0000-0000-0000-000000000003',
   '沖縄パイナップル 1玉', 'tropical', 1980, 'JPY',
   '芯まで甘い、沖縄産パイナップル。', 15, '沖縄県', 'active'),
  ('11111111-1111-1111-1111-111111111106', '00000000-0000-0000-0000-000000000002',
   'シャインマスカット 1房 700g前後', 'grape', 4200, 'JPY',
   '皮ごと食べられる、種なしシャインマスカット。', 5, '岡山県', 'active')
on conflict (id) do update
  set title = excluded.title,
      price = excluded.price,
      stock = excluded.stock,
      status = excluded.status;

-- ---- 3. Listing images --------------------------------------------------
insert into public.listing_images (listing_id, image_url, sort_order)
values
  ('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1200', 0),
  ('11111111-1111-1111-1111-111111111102', 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=1200', 0),
  ('11111111-1111-1111-1111-111111111103', 'https://images.unsplash.com/photo-1547514701-42782101795e?w=1200', 0),
  ('11111111-1111-1111-1111-111111111104', 'https://images.unsplash.com/photo-1605027990121-cbae9e0642dc?w=1200', 0),
  ('11111111-1111-1111-1111-111111111105', 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=1200', 0),
  ('11111111-1111-1111-1111-111111111106', 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=1200', 0)
on conflict do nothing;

-- ---- 4. Sample inquiries ------------------------------------------------
insert into public.inquiries (listing_id, buyer_id, seller_id, subject, message, status)
values
  ('11111111-1111-1111-1111-111111111101', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
   '配送について', 'こんにちは。こちらの商品は来週中に発送可能でしょうか？', 'open'),
  ('11111111-1111-1111-1111-111111111104', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003',
   '在庫の確認', '4玉での購入は可能ですか？', 'open')
on conflict do nothing;
