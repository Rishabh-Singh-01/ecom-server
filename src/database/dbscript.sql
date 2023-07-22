-- Setting up the database --
DROP DATABASE clothing_db;
CREATE DATABASE clothing_db;
USE clothing_db;

-- ################# Creating tables and schema ##################### --

CREATE TABLE users (
  id varchar(36) PRIMARY KEY,
  full_name varchar(100),
  email varchar(100) NOT NULL UNIQUE,
  gender int,
  created_at Timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_addresses(
  id varchar(36) PRIMARY KEY,
  user_id varchar(36) NOT NULL,
  full_name varchar(36) NOT NULL,
  mobile_no varchar(10) NOT NULL,
  pincode varchar(6) NOT NULL,
  state varchar(50) NOT NULL,
  address varchar(255) NOT NULL,
  town varchar(100) NOT NULL,
  district varchar(100) NOT NULL,
  address_type int NOT NULL,
  default_address boolean DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE product_categories(
   id varchar(36) PRIMARY KEY,
   category_name varchar(50) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	deleted_at timestamp ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sizes(
   id varchar(36) PRIMARY KEY,
   size_name varchar(5) NOT NULL UNIQUE,
   size_description Text NOT NULL,
   category_id varchar(36) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	deleted_at timestamp ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- setting up themes 
CREATE TABLE themes(
	id varchar(36) NOT NULL,
    product_category_id varchar(36) NOT NULL,
    title varchar(100) NOT NULL UNIQUE,
    description varchar(255) NOT NULL,
    examples varchar(100) NOT NULL,
    image TEXT NOT NULL,
    created_at Timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	deleted_at timestamp ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (product_category_id) REFERENCES product_categories(id)
);

-- setting up sex

CREATE TABLE gender_categories(
	id varchar(36) PRIMARY KEY,
    title varchar(20) NOT NULL UNIQUE,
    images text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	deleted_at timestamp ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
   id varchar(36) PRIMARY KEY,
   name varchar(100) NOT NULL UNIQUE,
   description text NOT NULL,
   images text NOT NULL,
   previous_price decimal(6,2) NOT NULL,
   price decimal(6,2) NOT NULL,
   fabric text NOT NULL,
   category_id varchar(36) NOT NULL,
   theme_id varchar(36) NOT NULL,
   gender_categories_id varchar(36) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	deleted_at timestamp ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id),
    FOREIGN KEY (theme_id) REFERENCES themes(id),
    FOREIGN KEY (gender_categories_id) REFERENCES gender_categories(id)
);

CREATE TABLE inventory (
	id int PRIMARY KEY AUTO_INCREMENT,
	product_id varchar(36),
    size_id varchar(36) NOT NULL,
    quantity int NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (size_id) REFERENCES sizes(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
  id int PRIMARY KEY AUTO_INCREMENT,
  user_id varchar(36) NOT NULL,
  status boolean NOT NULL,
  created_at Timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items(
  order_id int PRIMARY KEY AUTO_INCREMENT,
  product_id varchar(36) NOT NULL,
  quantity int NOT NULL,
  created_at Timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE cart_items(
	id int AUTO_INCREMENT NOT NULL,
	user_id varchar(36) NOT NULL, 
	product_id varchar(36) NOT NULL,
	created_at Timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	deleted_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id,product_id),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (product_id) REFERENCES products(id),
    KEY id (id)
);

CREATE TABLE cart_item_variations(
	cart_item_id INT NOT NULL,
    size_id varchar(36) NOT NULL,
    quantity int NOT NULL,
    created_at Timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp ON UPDATE CURRENT_TIMESTAMP,
	deleted_at timestamp ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (cart_item_id,size_id),
    FOREIGN KEY (cart_item_id) REFERENCES cart_items(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(id)
);

############ INSERTION OF THE FOLLOWING TABLES STARTS HERE ############### --

-- SELECT * FROM SIZES;

INSERT INTO product_categories(id,category_name) VALUES
	(uuid(),"T-Shirts");

-- INSERTING VALUES FOR BASIC TABLE LIKES SIZES AND CATERGORIES ---

INSERT INTO sizes(id,size_name,size_description,category_id) VALUES
	(uuid(),"S","Title:Small Size#Length:28#Chest#32",( SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts")),
    (uuid(),"M","Title:Medium Size#Length:30#Chest#34",( SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts")),
    (uuid(),"L","Title:Large Size#Length:32#Chest#36",( SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"));

-- ADDING THEMES

INSERT INTO themes(id,product_category_id,title,description,examples,image) VALUES
	(uuid(),(SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),'Timeless Legends','Classic anime series which have become iconic and beloved over time','Naruto#One Piece','previewthemeimage-1'),
	(uuid(),(SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),'Modern Marvels','Trendy anime series which have gained immense popularity in recent years','Attack On Titans#Demon Slayer','previewthemeimage-2'),
    (uuid(),(SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),'Eternal Legacy','Legacy anime series which have left lasting impact and established its place as a legacy series','Yu Yu Hakusho#Inuyasha','previewthemeimage-3'),
    (uuid(),(SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),'Hidden Gems','Underrated anime series highly regarded for their exceptional storytelling and unique qualities','Monster#Cowboy Bepop','previewthemeimage-4'),
    (uuid(),(SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),'Manga Masterpieces','Manga-based series known for their intricate artwork, deep narratives, and compelling characters','Berserk#Vagabond','previewthemeimage-5'),
    (uuid(),(SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),'Forbidden Fandom','NSFW based series that explore themes, visuals, and narratives intended for a more mature audience.','High School DxD#Elfen Lied','previewthemeimage-6');
    
-- SELECT * FROM product_categories;

-- ADDING gender_categories

INSERT INTO gender_categories(id,title,images) VALUES
	(uuid(),'MEN','previewgendercategory-men'),
    (uuid(),'WOMEN','previewgendercategory-women'),
    (uuid(),'UNISEX','previewgendercategory-unisex');

-- ---------> INSERTING VALUES FOR INVENTORY AND PRODUCTS SEQUENTIALLY --

INSERT INTO products(id,name,description,images,previous_price,price,fabric,category_id,theme_id,gender_categories_id) VALUES 
	(uuid(),
    "Johan White T-Shirt Monster",
    "T shirt based on Monster Anime depicting classic white tee with high quality fabric",
    "image-1#image-2",
    399,
    299,
    "Cotton:100",
    ( SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),
    ( SELECT themes.id FROM themes JOIN product_categories ON themes.product_category_id = product_categories.id WHERE product_categories.category_name = "T-Shirts" AND themes.title = 'Hidden Gems'),
    ( SELECT gender_categories.id FROM gender_categories WHERE gender_categories.title = 'MEN')
);

 INSERT INTO inventory(product_id,size_id,quantity) VALUES 
 	((SELECT id from products WHERE name = "Johan White T-Shirt Monster"), 
    (SELECT id FROM sizes WHERE size_name = "S"), 
    10);
    
 INSERT INTO inventory(product_id,size_id,quantity) VALUES 
 	((SELECT id from products WHERE name = "Johan White T-Shirt Monster"), 
    (SELECT id FROM sizes WHERE size_name = "M"), 
    5);
       
INSERT INTO products(id,name,description,images,previous_price,price,fabric,category_id,theme_id,gender_categories_id) VALUES 
	(uuid(),
    "Naruto Multicoloured T-Shirt Cotton",
    "Naruto Uzumaki & Saskue Uchiha T shirt based on Naruto Anime depicting trendy T-Shirt with high quality fabric",
    "image-1#image-2",
    599,
    499,
    "Cotton:95#Polyester:5",
	( SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),
	( SELECT themes.id FROM themes JOIN product_categories ON themes.product_category_id = product_categories.id WHERE product_categories.category_name = "T-Shirts" AND themes.title = 'Timeless Legends'),
	( SELECT gender_categories.id FROM gender_categories WHERE gender_categories.title = 'UNISEX')
);

 INSERT INTO inventory(product_id,size_id,quantity) VALUES 
 	((SELECT id from products WHERE name = "Naruto Multicoloured T-Shirt Cotton"), 
    (SELECT id FROM sizes WHERE size_name = "M"), 
    15);

INSERT INTO products(id,name,description,images,previous_price,price,fabric,category_id,theme_id,gender_categories_id) VALUES 
	(uuid(),
    "Asta Black Clover T-Shirt Polyester",
    "Asta in demonic form T-Shirt made for Sports with very breathable polyester fabric",
    "image-1#image-2",
    499,
    399,
    "Polyester:100",
	( SELECT id FROM product_categories WHERE product_categories.category_name = "T-Shirts"),
	( SELECT themes.id FROM themes JOIN product_categories ON themes.product_category_id = product_categories.id WHERE product_categories.category_name = "T-Shirts" AND themes.title = 'Modern Marvels'),
	( SELECT gender_categories.id FROM gender_categories WHERE gender_categories.title = 'WOMEN')
);

 INSERT INTO inventory(product_id,size_id,quantity) VALUES 
 	((SELECT id from products WHERE name = "Asta Black Clover T-Shirt Polyester"), 
    (SELECT id FROM sizes WHERE size_name = "L"), 
    20);

SELECT * FROM inventory;
SELECT * FROM products join gender_categories on products.gender_categories_id = gender_categories.id where gender_categories.title = 'men';
SELECT * FROM users;




