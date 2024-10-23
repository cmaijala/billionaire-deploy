CREATE TABLE billionaires (
	rank INTEGER,
	finalWorth DOUBLE PRECISION,
	category VARCHAR(50),
	personName VARCHAR(100),
	age REAL,
	country VARCHAR(50),
	city VARCHAR(50),
	source VARCHAR(50),
	industries VARCHAR(50),
	countryOfCitizenship VARCHAR(50),
	selfMade BOOLEAN,
	gender VARCHAR(1),
	birthDate VARCHAR(50),
	lastName VARCHAR(50),
	firstName VARCHAR(50),
	country_cpi DOUBLE PRECISION,
	country_population DOUBLE PRECISION,
	country_lat DOUBLE PRECISION,
	country_long DOUBLE PRECISION
);

SELECT * FROM billionaires;

DROP TABLE billionaires;

CREATE TABLE billionaires_raw (
	rank INTEGER,
	finalWorth DOUBLE PRECISION,
	category VARCHAR(50),
	personName VARCHAR(100),
	age REAL,
	country VARCHAR(50),
	city VARCHAR(50),
	source VARCHAR(50),
	industries VARCHAR(50),
	countryOfCitizenship VARCHAR(50),
	organization VARCHAR(50),
	selfMade BOOLEAN,
	status VARCHAR(50),
	gender VARCHAR(1),
	birthDate VARCHAR(50),
	lastName VARCHAR(50),
	firstName VARCHAR(50),
	title VARCHAR(100),
	date VARCHAR(50),
	state VARCHAR(50),
	residenceStateRegion VARCHAR(50),
	birthYear INTEGER,
	birthMonth INTEGER,
	birthDay INTEGER,
	cpi_country DOUBLE PRECISION,
	cpi_change_country REAL,
	gdp_country VARCHAR(50),
	gross_tertiary_education_enrollment REAL,
	gross_primary_education_enrollment_country REAL,
	life_expectancy_country REAL,
	tax_revenue_country_country REAL,
	total_tax_rate_country REAL,
	population_country DOUBLE PRECISION,
	latitude_country DOUBLE PRECISION,
	longitude_country DOUBLE PRECISION
);

SELECT * FROM billionaires_raw;

DROP TABLE billionaires_raw;