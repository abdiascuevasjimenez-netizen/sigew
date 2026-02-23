-- SIGEW: Sistema de Gestión Escolar Web
-- Schema for MySQL (XAMPP Compatible)
-- Project: Análisis y Diseño de Sistemas 1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Estructura de tabla para Estudiantes
CREATE TABLE `estudiantes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `numero_orden` int(11) DEFAULT NULL,
  `grado` varchar(50) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `info_salud` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Estructura de tabla para Profesores
CREATE TABLE `profesores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Estructura de tabla para Materias
CREATE TABLE `materias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `profesor_id` int(11) DEFAULT NULL,
  `horario` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`profesor_id`) REFERENCES `profesores`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Estructura de tabla para Calificaciones
CREATE TABLE `calificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estudiante_id` int(11) NOT NULL,
  `materia_id` int(11) NOT NULL,
  `nota_asistencia` int(3) DEFAULT 0,
  `nota_practicas` int(3) DEFAULT 0,
  `nota_examen` int(3) DEFAULT 0,
  `nota_final` int(3) GENERATED ALWAYS AS (nota_asistencia + nota_practicas + nota_examen) STORED,
  `periodo` varchar(20) DEFAULT '2026-1',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`materia_id`) REFERENCES `materias`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion of Sample Data
INSERT INTO `estudiantes` (`nombre`, `numero_orden`, `grado`, `info_salud`) VALUES
('Eleny Nuñez', 14, '12vo A', 'Alérgica al polen'),
('Yadelin Donais', 4, '12vo A', 'Buen estado'),
('Abdias Cuevas', 3, '12vo A', 'Asma leve'),
('Daniel Mercedes', 12, '12vo A', 'Sano'),
('Richard Espiritusanto', 5, '12vo A', 'Sano'),
('Abraham Mejía', 11, '12vo A', 'Sano');

INSERT INTO `profesores` (`nombre`, `especialidad`, `usuario`, `password`) VALUES
('Ramón Martínez', 'Analista de Sistemas', 'ramon', 'admin123');

INSERT INTO `materias` (`nombre`, `profesor_id`, `horario`) VALUES
('Análisis y Diseño 1', 1, 'Lun-Mie 8:00 AM');

INSERT INTO `calificaciones` (`estudiante_id`, `materia_id`, `nota_asistencia`, `nota_practicas`, `nota_examen`) VALUES
(3, 1, 10, 30, 55);

COMMIT;
