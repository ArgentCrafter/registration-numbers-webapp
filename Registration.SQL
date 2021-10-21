CREATE TABLE registration (id serial, registration_number text not null, town_code_id int not null,
Foreign key(town_code_id) references towns(id));

CREATE TABLE towns (id integer primary key not null, town_name text not null, town_code text not null);

INSERT INTO towns (id, town_name, town_code) VALUES (1, 'Bellville' 'CY');
INSERT INTO towns (id, town_name, town_code) VALUES (2, 'Cape Town' 'CA');
INSERT INTO towns (id, town_name, town_code) VALUES (3, 'Malmesbury' 'CK');