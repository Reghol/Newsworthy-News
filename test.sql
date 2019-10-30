\c nc_news_test

DROP DATABASE IF EXISTS nc_news_test;
CREATE DATABASE nc_news_test;

SELECT * FROM articles
JOIN comments 
ON articles.article_id = comments.article_id;