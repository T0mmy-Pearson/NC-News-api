\c 
COPY (SELECT * FROM users) TO '../northcoders-news-be/query-output/users.txt' WITH (FORMAT text);


COPY (SELECT * FROM articles WHERE topic = 'coding') TO '/articles_coding.txt' WITH (FORMAT text);


COPY (SELECT * FROM comments WHERE votes < 0) TO '/comments_negative_votes.txt' WITH (FORMAT text);


COPY (SELECT * FROM topics) TO '/topics.txt' WITH (FORMAT text);


COPY (SELECT * FROM articles WHERE author = 'grumpy19') TO '/articles_grumpy19.txt' WITH (FORMAT text);


COPY (SELECT * FROM comments WHERE votes > 10) TO '/comments_high_votes.txt' WITH (FORMAT text);