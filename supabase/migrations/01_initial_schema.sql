-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chats table
create table public.chats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model_used text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_summaries table for clerk agent memory
create table public.chat_summaries (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  summary text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.chat_summaries enable row level security;

-- Create policies
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view own chats" on public.chats for select using (auth.uid() = user_id);
create policy "Users can create own chats" on public.chats for insert with check (auth.uid() = user_id);
create policy "Users can update own chats" on public.chats for update using (auth.uid() = user_id);
create policy "Users can delete own chats" on public.chats for delete using (auth.uid() = user_id);

create policy "Users can view messages in own chats" on public.messages for select using (
  exists (
    select 1 from public.chats 
    where chats.id = messages.chat_id 
    and chats.user_id = auth.uid()
  )
);
create policy "Users can create messages in own chats" on public.messages for insert with check (
  exists (
    select 1 from public.chats 
    where chats.id = messages.chat_id 
    and chats.user_id = auth.uid()
  )
);

create policy "Users can view summaries of own chats" on public.chat_summaries for select using (
  exists (
    select 1 from public.chats 
    where chats.id = chat_summaries.chat_id 
    and chats.user_id = auth.uid()
  )
);
create policy "Users can create summaries for own chats" on public.chat_summaries for insert with check (
  exists (
    select 1 from public.chats 
    where chats.id = chat_summaries.chat_id 
    and chats.user_id = auth.uid()
  )
);
create policy "Users can update summaries for own chats" on public.chat_summaries for update using (
  exists (
    select 1 from public.chats 
    where chats.id = chat_summaries.chat_id 
    and chats.user_id = auth.uid()
  )
);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
