CREATE SEQUENCE custom_id_sequence START WITH (SELECT COALESCE(MAX(id)+1, 1) FROM users);

CREATE TABLE recipe (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    ingredients TEXT NOT NULL,
    category_id INT NOT NULL,
    photo VARCHAR NOT NULL,
    users_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE 
    category (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE recipe DROP COLUMN category;

ALTER TABLE users ADD COLUMN public_id VARCHAR;

UPDATE recipe SET category_id=1 WHERE photo='https://placehold.co/600x400';

ALTER TABLE recipe ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE recipe ADD FOREIGN KEY (category_id) REFERENCES category(id);

ALTER TABLE recipe ADD FOREIGN KEY (users_id) REFERENCES users(id);


SELECT * FROM recipe WHERE users_id=20;


ALTER TABLE category ADD CONSTRAINT id UNIQUE (id);

DELETE FROM recipe WHERE category_id=1;

INSERT INTO recipe(title,ingredients,category_id,photo) VALUES('Spring Rolls','Kulit lumpia, kol, wortel, tauge, udang cincang, daging ayam cincang, daun bawang, saus soya, saus oyster, minyak wijen, dan bumbu lainnya.','1','https://placehold.co/600x400');

DROP TABLE recipe;

ALTER TABLE recipe DROP CONSTRAINT category_id;

DROP DATABASE myapi;


SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, category.name AS category FROM recipe JOIN category ON recipe.category_id = category.id WHERE title ILIKE '%spring%';

SELECT * FROM category WHERE name ILIKE '%Main%';

DROP TABLE users;

DELETE FROM recipe WHERE id=22;

SELECT re.id, re.title, re.ingredients, re.photo, cat.name AS category, us.username AS creator
FROM recipe re
JOIN category cat ON re.category_id = cat.id
JOIN users us ON re.users_id = us.id
ORDER BY re.id;

SELECT re.id, re.title, re.ingredients, re.photo, re.category_id, cat.name AS category, re.users_id, us.username AS creator, us.photo AS creator_photo, re.created_at
            FROM recipe re
            JOIN category cat ON re.category_id = cat.id
            JOIN users us ON re.users_id = us.id
            WHERE re.id=161
            ORDER BY re.id DESC;

            SELECT * FROM users WHERE id=36;