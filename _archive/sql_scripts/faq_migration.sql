-- Create the FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT extensions.gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('general', 'business', 'operator')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to FAQs
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.faqs FOR SELECT
  USING ( true );

-- Initial Seed Data: General Community
INSERT INTO public.faqs (category, question, answer) VALUES
('general', 'How do I create an account?', 'You can create an account by clicking the "Sign Up" button on the top right corner. You can use your email address or sign in with your Google or Facebook account.'),
('general', 'Is the marketplace free to use?', 'Yes! Browsing and buying items on the Marinduque Connect marketplace is completely free. We do not charge transaction fees for standard community sales.'),
('general', 'How are community guidelines enforced?', 'Our AI moderation and community reporting tools ensure that all posts follow our community guidelines. Any inappropriate content will be flagged and removed.'),
('general', 'What are "Gems of Marinduque"?', 'The "Gems" section highlights the best local spots, hidden beaches, and highly-rated restaurants on the island, curated by local residents and visitors.');

-- Initial Seed Data: Local Business
INSERT INTO public.faqs (category, question, answer) VALUES
('business', 'How do I claim my business directory profile?', 'Search for your business in the Directory. If you find it, click "Claim Because It''s Mine" and follow the verification steps. If it''s not listed, you can create a new profile from your dashboard.'),
('business', 'Does it cost money to post a job vacancy?', 'Basic job postings are free for local Marinduque businesses. You can upgrade to a "Spotlight" job post to get your listing pinned to the top of the Jobs page for a small fee.'),
('business', 'How do I update my operating hours?', 'Once you have claimed your business, go to your Business Dashboard, select "Edit Profile", and scroll down to the "Operating Hours" section. Don''t forget to save your changes!'),
('business', 'What is the "Best of Boac Spotlight"?', 'The Spotlight is a premium monthly feature where we showcase a select business on our homepage, driving more customer traffic to your profile.');

-- Initial Seed Data: Transport / Commute Operators
INSERT INTO public.faqs (category, question, answer) VALUES
('operator', 'How do I list my tricycle or boat for transport?', 'Go to the "Commute" section and tap "Register as an Operator". You will need to upload a photo of your vehicle/boat and a valid ID or operator''s permit.'),
('operator', 'How do payouts work for bookings?', 'For cash trips, you keep 100% of the fare directly from the passenger. For online bookings through the app, payouts are transferred to your registered GCash account every Friday.'),
('operator', 'Can I set my own schedule?', 'Yes. In your Operator Dashboard, you can toggle your status to "Active" when you are ready to accept passengers and "Offline" when you are done for the day.'),
('operator', 'What happens if a passenger cancels?', 'If a passenger cancels an online prepaid booking after you have arrived, you are eligible for a partial cancellation fee. Please review our Operator Cancellation Policy in the help center.');
