-- Create Table query for clients_db

CREATE TABLE "clients" (
    "last_name" varchar(30)   NOT NULL,    
    "first_name" varchar(30)   NOT NULL,
    "unit" varchar(10),    
    "street_number" integer   NOT NULL,
    "street_name" varchar(30)   NOT NULL,
    "street_type" varchar(10)   NOT NULL,
    "suburb" varchar(20)   NOT NULL,
    "postcode" varchar(4)   NOT NULL,
    "full_address" varchar(50)   NOT NULL,
    "number_adults" integer   NOT NULL,
    "number_children" integer   NOT NULL,
    "lat" float   NOT NULL,
    "long" float   NOT NULL,
    "primary_phone" varchar(13)   NOT NULL,
    "emergency_phone" varchar(13),
    "risk" varchar(4)  NOT NULL
);



