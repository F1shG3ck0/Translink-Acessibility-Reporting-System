-- create table statement for tblStop with auto-incrementing primary key, unique constraint on stopName, and index on stopType
CREATE TABLE tblStop (
    stopId INT AUTO_INCREMENT NOT NULL,
    stopName VARCHAR(255) UNIQUE NOT NULL,
    stopType ENUM('Bus Stop','Train Station','Bus & Train Station','Buscentre') NOT NULL,
    PRIMARY KEY (stopId),
    INDEX idx_stop_type (stopType)
);

-- create table statement for tblRoute with auto-incrementing primary key, unique constraint on the combination of routeName, endLocation and startLocation 
CREATE TABLE tblRoute (
    routeId INT AUTO_INCREMENT NOT NULL, 
    routeName VARCHAR(100) NOT NULL, 
    startLocation VARCHAR(50) NOT NULL, 
    endLocation VARCHAR(50) NOT NULL,
    PRIMARY KEY (routeId),
    UNIQUE (routeName, endLocation, startLocation) 
);
 
 -- create table statement for tblVehicle with auto-incrementing primary key, enum to enforce valid vehicle types, unsigned int for maxCapacity to prevent negative values, and index on vehicleType
CREATE TABLE tblVehicle(
    vehicleId INT AUTO_INCREMENT NOT NULL,
    vehicleType ENUM('Metro', 'Glider', 'Foyle Metro', 'Goldliner', 'Ulsterbus', 'NI Railways', 'Airport Express 300' ) NOT NULL,
    maxCapacity INT UNSIGNED NOT NULL,
    PRIMARY KEY (vehicleId),
    INDEX idx_vehicle_type (vehicleType)
);

-- create table statement for tblFeature with auto-incrementing primary key, enum to enforce valid feature categories of either Vehicle or Stop and index on featureCategory.
CREATE TABLE tblFeature(
    featureId INT AUTO_INCREMENT NOT NULL,
    featureName VARCHAR(50) NOT NULL,
    featureCategory ENUM('Vehicle', 'Stop') NOT NULL,
    PRIMARY KEY (featureId), 
    INDEX idx_feature_category (featureCategory)
);
  
-- create table statement for tblStopFeature with composite primary key and foreign keys referencing tblStop and tblFeature  
CREATE TABLE tblStopFeature (
    stopId INT NOT NULL,
    featureId INT NOT NULL,
    PRIMARY KEY (stopId, featureId),
    FOREIGN KEY (stopId) REFERENCES tblStop(stopId),
    FOREIGN KEY (featureId) REFERENCES tblFeature(featureId)
);

-- create table statement for tblRouteStop with composite primary key and foreign keys referencing tblRoute and tblStop   
CREATE TABLE tblRouteStop (
    routeId INT NOT NULL,
    stopId INT NOT NULL,
    PRIMARY KEY (routeId, stopId),
    FOREIGN KEY (routeId) REFERENCES tblRoute(routeId),
    FOREIGN KEY (stopId) REFERENCES tblStop(stopId)
);

-- create table statement for tblVehicleFeature with composite primary and foreign keys referencing tblVehicle and tblFeature
CREATE TABLE tblVehicleFeature( 
VehicleID INT NOT NULL, 
FeatureId INT NOT NULL, 
PRIMARY KEY (vehicleId, featureId), 
FOREIGN KEY (vehicleId) REFERENCES tblVehicle(vehicleId), 
FOREIGN KEY (featureId) REFERENCES tblFeature(featureId) 
);

-- create table statement for tblOperator with auto-incrementing primary key, unique constraint on contactEmail, and index on serviceType, operatorLastName
CREATE TABLE tblOperator(
    operatorId INT AUTO_INCREMENT NOT NULL,
    operatorFirstName VARCHAR(50) NOT NULL,
    operatorLastName VARCHAR(50) NOT NULL,
    serviceType ENUM('Bus', 'Train') NOT NULL,
    contactEmail VARCHAR(100) UNIQUE NOT NULL,
    PRIMARY KEY (operatorId),
    INDEX idx_operator_serviceType (serviceType),
    INDEX idx_operator_lastName (operatorLastName)
);

-- create table statement for tblTrip with auto-incrementing primary key, constraints for vehicle unique for a trip on a certain date and time, operator unique for a trip on a certain date and time, and scheduled departure date before scheduled arrival date. index on stopType .
CREATE TABLE tblTrip(
    tripId INT AUTO_INCREMENT NOT NULL,
    routeId INT NOT NULL,
    vehicleId INT NOT NULL,
    operatorId INT NOT NULL,
    scheduledDeparture DATETIME NOT NULL,
    scheduledArrival DATETIME NOT NULL,
    PRIMARY KEY (tripId),
    FOREIGN KEY (routeId) REFERENCES tblRoute(routeId),
    FOREIGN KEY (vehicleId) REFERENCES tblVehicle(vehicleId),
    FOREIGN KEY (operatorId) REFERENCES tblOperator(operatorId),
    UNIQUE (vehicleId, scheduledDeparture),
    UNIQUE (operatorId, scheduledDeparture),
    CONSTRAINT chk_arrival_after_departure 
    CHECK (scheduledArrival > scheduledDeparture),
    INDEX idx_trip_departure (scheduledDeparture)
);

-- create table statement for tblComplaint with auto-incrementing primary key, nullable foreign keys to tripId and stopId with a check constraint ensuring exactly one is provided, enum to enforce valid complaint types, default timestamp for complaintDate, tinyint with check constraint to enforce boolean isResolved. Indexes on isResolved and complaintType.

CREATE TABLE tblComplaint (
    complaintId INT AUTO_INCREMENT NOT NULL, 
    tripId INT,
    stopId INT,
    complaintDetails VARCHAR(300) NOT NULL,
    complaintType ENUM ('Accessibility', 'Service', 'Reliability', 'Staff Behaviour', 'Vehicle Condition',  'Stop Condition', 'Safety', 'Other') NOT NULL,
    complaintDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    isResolved TINYINT(1) NOT NULL DEFAULT 0 CHECK(isResolved IN (0,1)),
    PRIMARY KEY (complaintId),
    FOREIGN KEY (tripId) REFERENCES tblTrip(tripId),
    FOREIGN KEY (stopId) REFERENCES tblStop(stopId),
    CONSTRAINT chk_trip_or_stop_new
    CHECK ((tripId IS NOT NULL AND stopId IS NULL) OR (tripId IS NULL AND stopId IS NOT NULL)),
    INDEX idx_complaint_isResolved (isResolved),
    INDEX idx_complaint_type (complaintType)
);

-- create table statement for tblTicket with auto-incrementing primary key, an enum as the datatype for ticketType to enforce the entry of valid ticket types, and an index on ticketType
CREATE TABLE tblTicket (
    ticketId INT AUTO_INCREMENT NOT NULL,
    ticketType ENUM(
        'Single',
        'Return',
        'Half Fare',
        'SmartPass',
        'Senior SmartPass',
        'Registered Blind SmartPass',
        'War Disablement SmartPass'
    ) NOT NULL,
    PRIMARY KEY (ticketId),
    INDEX idx_ticket_type (ticketType)
);

-- create table statement for tblValidTicket with composite primary key and foreign keys referencing tblTicket and tblTrip. 
CREATE TABLE tblValidTicket(
    ticketId INT NOT NULL,
    tripId INT NOT NULL,
    PRIMARY KEY (ticketId, tripId),
    FOREIGN KEY (ticketId) REFERENCES tblTicket(ticketId),
    FOREIGN KEY (tripId) REFERENCES tblTrip(tripId)
);