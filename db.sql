-- CREATE DATABASE greenhouse;

CREATE TABLE `history` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `temperature` int(3) DEFAULT NULL,
                           `humidity` int(3) DEFAULT NULL,
                           `soil_moisture_1` int(4) DEFAULT NULL,
                           `soil_moisture_2` int(4) DEFAULT NULL,
                           `water_level` int(4) DEFAULT NULL,
                           `fan_in` int(3) DEFAULT 0,
                           `fan_out` int(3) DEFAULT 0,
                           `pomp_off` tinyint(1) DEFAULT 0,
                           `veg_lamp_off` tinyint(1) DEFAULT 0,
                           `fruit_lamp_off` tinyint(1) DEFAULT 0,
                           `modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                           `date` date NOT NULL DEFAULT curdate(),
                           `cycle_id` int(11) DEFAULT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `water_tank` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `length` int(3) DEFAULT NULL,
                              `height` int(3) DEFAULT NULL,
                              `width` int(3) DEFAULT NULL,
                              `min_fill` int(3) DEFAULT NULL,
                              `max_fill` int(3) NOT NULL,
                              `ml_s` decimal(4,2) DEFAULT NULL,
                              PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `events` (
                          `event_id` int(11) NOT NULL AUTO_INCREMENT,
                          `event_type` varchar(100) DEFAULT NULL,
                          `function_name` varchar(100) DEFAULT NULL,
                          `event_request` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
                          `event_result` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
                          `event_error` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
                          `event_date` timestamp NOT NULL DEFAULT current_timestamp(),
                          PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `pomp_settings` (
                                 `id` int(11) NOT NULL AUTO_INCREMENT,
                                 `run_status` tinyint(1) NOT NULL,
                                 `run_seconds` int(2) NOT NULL,
                                 `sleep_seconds` int(2) NOT NULL,
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `username` varchar(100) NOT NULL,
                         `password` varchar(100) NOT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `soil_moisture` (
                                 `id` int(11) NOT NULL AUTO_INCREMENT,
                                 `dry` int(4) NOT NULL,
                                 `wet` int(4) NOT NULL,
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `relay_map` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `pin` tinyint(1) NOT NULL,
                             `description` varchar(15) NOT NULL,
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `fan_settings` (
                                `id` int(11) NOT NULL AUTO_INCREMENT,
                                `min` int(4) NOT NULL,
                                `max` int(4) NOT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE `stage` (
                         `id` tinyint(4) NOT NULL AUTO_INCREMENT,
                         `name` varchar(10) NOT NULL DEFAULT '0',
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `schedule` (
                            `id` int(11) NOT NULL AUTO_INCREMENT,
                            `stage_id` tinyint(1) NOT NULL,
                            `max_temp` int(11) DEFAULT NULL,
                            `min_temp` int(11) DEFAULT NULL,
                            `max_humidity` int(11) DEFAULT NULL,
                            `min_humidity` int(11) DEFAULT NULL,
                            `lamp_start` int(2) DEFAULT NULL,
                            `lamp_stop` int(2) DEFAULT NULL,
                            `modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                            `date` date NOT NULL DEFAULT curdate(),
                            `water_ml` int(11) NOT NULL,
                            `min_moist` int(11) NOT NULL,
                            PRIMARY KEY (`id`),
                            KEY `schedule_stage_FK` (`stage_id`),
                            CONSTRAINT `schedule_stage_FK` FOREIGN KEY (`stage_id`) REFERENCES `stage` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `growth` (
                          `id` int(11) NOT NULL AUTO_INCREMENT,
                          `active` tinyint(1) DEFAULT NULL,
                          `date` date NOT NULL DEFAULT curdate(),
                          PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE `cycle` (
                         `id` int(10) NOT NULL AUTO_INCREMENT,
                         `growth_id` int(11) DEFAULT NULL,
                         `schedule_id` int(11) DEFAULT NULL,
                         `active_cycle` tinyint(1) NOT NULL DEFAULT 0,
                         `start_date` date NOT NULL DEFAULT curdate(),
                         `end_date` date DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         KEY `cycle_schedule_FK` (`growth_id`),
                         KEY `cycle_schedule_FK2` (`schedule_id`),
                         CONSTRAINT `cycle_growth_FK` FOREIGN KEY (`growth_id`) REFERENCES `growth` (`id`),
                         CONSTRAINT `cycle_schedule_FK2` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO water_tank
(id, `length`, height, width, min_fill, max_fill, ml_s)
VALUES(1, 430, 224, 120, 190, 30, 1.20);

INSERT INTO pomp_settings
(id, run_status, run_seconds, sleep_seconds)
VALUES(1, 1, 10, 5);

INSERT INTO soil_moisture
(id, dry, wet)
VALUES(1, 690, 560);

INSERT INTO relay_map
(id, pin, description)
VALUES(1, 2, 'DTH22 SENSOR');
INSERT INTO relay_map
(id, pin, description)
VALUES(2, 3, 'WATER POMP');
INSERT INTO relay_map
(id, pin, description)
VALUES(3, 5, 'VEG LAMP');
INSERT INTO relay_map
(id, pin, description)
VALUES(4, 6, 'FLOWER LAMP');
INSERT INTO relay_map
(id, pin, description)
VALUES(5, 45, 'FAN IN');
INSERT INTO relay_map
(id, pin, description)
VALUES(6, 44, 'FAN OUT');

INSERT INTO fan_settings
(id, min, max)
VALUES(1, 0, 255);

INSERT INTO stage
(id, name)
VALUES(1, 'SEED');
INSERT INTO stage
(id, name)
VALUES(2, 'VEG');
INSERT INTO stage
(id, name)
VALUES(3, 'FLOWER');
