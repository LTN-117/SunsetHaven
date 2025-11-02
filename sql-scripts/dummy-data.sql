-- Dummy Data for Sunset Haven Resort
-- Run this in Supabase SQL Editor to populate your database with sample data

-- Insert Sample Inquiries (15 inquiries with various statuses)
INSERT INTO inquiries (name, phone, inquiry_type, message, status, created_at) VALUES
('Chioma Okafor', '+234 803 456 7890', 'Premium Camping', 'Hello! I''m interested in booking a premium camping experience for my family of 4. We''re looking at the weekend of November 15-17. What packages do you have available?', 'new', NOW() - INTERVAL '2 hours'),
('David Chen', '+234 816 234 5678', 'Bespoke Events', 'We''re planning our company retreat for 50 people in December. Can you handle corporate events of this size? We''d need accommodation, catering, and team building activities.', 'read', NOW() - INTERVAL '1 day'),
('Fatima Bello', '+234 809 876 5432', 'General Inquiry', 'Is boat transport included in your packages? Also, do you have any special rates for groups of 10 or more?', 'responded', NOW() - INTERVAL '3 days'),
('Emmanuel Adeyemi', '+234 705 432 1098', 'Curated Networking', 'I attended your last networking event and it was amazing! When is the next one scheduled? I''d like to bring some colleagues.', 'responded', NOW() - INTERVAL '5 days'),
('Sarah Johnson', '+234 812 345 6789', 'Adventure Activities', 'What adventure activities do you offer? I''m particularly interested in water sports and beach activities for a weekend getaway.', 'new', NOW() - INTERVAL '4 hours'),
('Oluwaseun Bakare', '+234 807 654 3210', 'Premium Camping', 'Do you offer honeymoon packages? My fiancée and I are getting married in January and would love to spend our honeymoon at Sunset Haven.', 'read', NOW() - INTERVAL '6 hours'),
('Jennifer Nwosu', '+234 803 123 4567', 'Bespoke Events', 'Planning a birthday celebration for about 25 people. Can you accommodate this? Looking for something in late November. Budget is around ₦500,000.', 'new', NOW() - INTERVAL '30 minutes'),
('Michael Okonkwo', '+234 815 987 6543', 'General Inquiry', 'Are your facilities wheelchair accessible? My elderly mother uses a wheelchair and I''d love to bring her for a weekend visit.', 'read', NOW() - INTERVAL '2 days'),
('Aisha Mohammed', '+234 706 543 2109', 'Adventure Activities', 'I''m interested in photography opportunities at sunrise/sunset. Do you have any special photography packages or tours?', 'responded', NOW() - INTERVAL '1 week'),
('Daniel Eze', '+234 810 234 5678', 'Curated Networking', 'What''s the dress code for your networking events? Also, can I bring a plus one?', 'archived', NOW() - INTERVAL '2 weeks'),
('Grace Obi', '+234 804 567 8901', 'Premium Camping', 'Interested in a girls'' weekend for 6 friends. Do you have tents that can accommodate groups? What dates are available in December?', 'new', NOW() - INTERVAL '1 hour'),
('Ibrahim Hassan', '+234 817 890 1234', 'Bespoke Events', 'We want to host a product launch event on your beach. Can we bring our own vendors? Need capacity for about 100 guests.', 'read', NOW() - INTERVAL '8 hours'),
('Victoria Adeleke', '+234 808 345 6789', 'General Inquiry', 'What are your check-in and check-out times? Also, is there a minimum night stay requirement?', 'new', NOW() - INTERVAL '3 hours'),
('Emeka Nnamdi', '+234 709 876 5432', 'Adventure Activities', 'Do you offer scuba diving or snorkeling? Also interested in kayaking. What''s included in the adventure package?', 'responded', NOW() - INTERVAL '4 days'),
('Blessing Okoro', '+234 805 123 4567', 'Premium Camping', 'Can we book for just one night or is it a weekend package only? Looking at mid-week availability.', 'read', NOW() - INTERVAL '12 hours');

-- Insert Gallery Images (using actual images from public folder)
INSERT INTO gallery_images (image_url, caption, category, display_order, is_active) VALUES
('/IMG_8277.JPG', 'Sunset over Tarkwa Bay - A breathtaking view', 'sunset', 1, true),
('/IMG_8282.JPG', 'Golden hour at the beach', 'sunset', 2, true),
('/IMG_8285.JPG', 'Evening glow over the ocean', 'sunset', 3, true),
('/IMG_8287.JPG', 'Sunset silhouettes', 'sunset', 4, true),
('/IMG_8291.JPG', 'Dusk at Sunset Haven', 'sunset', 5, true),
('/premium-camping.jpg', 'Luxury camping experience under the stars', 'camping', 6, true),
('/adventure-activities.jpg', 'Beach activities and water sports', 'activities', 7, true),
('/curated-networking.jpg', 'Professional networking by the beach', 'events', 8, true),
('/bespoke-events.jpg', 'Custom events tailored to your needs', 'events', 9, true),
('/IMG_1091.jpg', 'Beach paradise at Tarkwa Bay', 'beach', 10, true),
('/IMG_2807.jpg', 'Tropical getaway', 'beach', 11, true),
('/IMG_3221.jpg', 'Island living at its finest', 'beach', 12, true),
('/IMG_3224.jpg', 'Pristine beach views', 'beach', 13, true),
('/IMG_8014.jpg', 'Relaxation and serenity', 'general', 14, true),
('/IMG_8026.jpg', 'Your escape from the city', 'general', 15, true),
('/IMG_8041.jpg', 'Nature meets luxury', 'general', 16, true),
('/IMG_8052.jpg', 'Beach vibes and good times', 'beach', 17, true),
('/IMG_8598.jpg', 'Coastal beauty', 'beach', 18, true),
('/IMG_8739.jpg', 'Paradise found', 'beach', 19, true),
('/IMG_8817.jpg', 'Tranquil waters', 'beach', 20, true),
('/IMG_8915.jpg', 'Island adventures await', 'activities', 21, true),
('/sunset-over-glamping-tents-with-ocean.jpg', 'Glamping with ocean views', 'camping', 22, true),
('/luxury-glamping-tent-interior-with-comfortable-bed.jpg', 'Comfortable tent interiors', 'camping', 23, true),
('/beach-entrance-with-palm-trees-and-resort.jpg', 'Welcome to paradise', 'general', 24, true),
('/aerial-resort-view-with-glamping-tents-beach-and-ocean.jpg', 'Aerial view of our resort', 'general', 25, true);

-- Insert Testimonials (realistic guest reviews)
INSERT INTO testimonials (guest_name, quote, guest_role, display_order, is_active) VALUES
('Adebayo Ogunlesi', 'Sunset Haven exceeded all our expectations! The premium camping experience was luxurious yet authentic. The sunset views were absolutely breathtaking. We''ll definitely be back!', 'Business Executive', 1, true),
('Kemi Adeyemi', 'Perfect spot for our corporate retreat. The team bonding activities were well-organized, and the beachfront setting made for an unforgettable experience. Highly recommend for corporate events!', 'HR Manager, Tech Startup', 2, true),
('James & Olivia Chen', 'We celebrated our anniversary here and it was magical. The staff went above and beyond to make our stay special. The beach is pristine and the sunset views are unmatched in Lagos.', 'Couple', 3, true),
('Funke Oladele', 'As a Lagos professional, I needed a quick escape from the hustle. Sunset Haven delivered! Just 15 minutes by boat but feels like a world away. The networking event I attended was also top-notch.', 'Marketing Director', 4, true),
('Marcus Williams', 'The adventure activities package was incredible! From kayaking to beach volleyball, there''s something for everyone. The guides were knowledgeable and safety-conscious. A must-visit!', 'Fitness Enthusiast', 5, true),
('Ngozi Ekwensi', 'Hosted my daughter''s 30th birthday here and it was a dream come true. The bespoke events team handled everything perfectly - from setup to catering. Our guests are still talking about it!', 'Mother & Event Planner', 6, true),
('Ahmed Suleiman', 'The photography opportunities here are endless! I''ve shot at many beaches in Lagos, but Tarkwa Bay''s natural beauty and Sunset Haven''s atmosphere are in a league of their own.', 'Professional Photographer', 7, true),
('Chidinma Nwosu', 'Came here for a girls'' weekend and we had the time of our lives! The glamping tents were so comfortable, the food was delicious, and the vibe was exactly what we needed. Can''t wait to return!', 'Content Creator', 8, true),
('Dr. Emeka Okafor', 'I''ve traveled extensively, and Sunset Haven ranks among the best eco-tourism experiences I''ve had. They''ve struck the perfect balance between luxury and sustainability. Impressive work!', 'Travel Blogger', 9, true),
('Sarah & David Olumide', 'Our honeymoon at Sunset Haven was absolutely perfect! The private beach access, romantic sunset dinners, and attentive staff made it unforgettable. Thank you for making our first days as a married couple so special!', 'Newlyweds', 10, true);

-- Success message
SELECT
  (SELECT COUNT(*) FROM inquiries) as total_inquiries,
  (SELECT COUNT(*) FROM gallery_images) as total_gallery_images,
  (SELECT COUNT(*) FROM testimonials) as total_testimonials;
