# NC News Seeding

Since .env.* files are ignored by Git, anyone who clones your project won’t have access to the required environment variables.

What you need to do:
set-up databases

1. in the root directory, create .env.test and .env.development
2. connect them to their respective databases:
    a. test: nc_news_test
    b. dev: nc_news

# lecture

dynamic queries: 

jest sorted - 
loop through results 
check if previous object is lower than the current
jest-sorted : paul copley

install: npm i jest-sorted -D

toBeSortedBy