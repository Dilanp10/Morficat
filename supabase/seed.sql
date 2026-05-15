-- MorfiCat — Seed de categorías y tipos de comida
-- Ejecutar después de schema.sql

insert into categorias (nombre, slug, emoji, orden) values
  ('Cafetería',  'cafeteria',  '☕', 1),
  ('Restaurante','restaurante','🍽️', 2),
  ('Bar',        'bar',        '🍺', 3),
  ('Heladería',  'heladeria',  '🍦', 4),
  ('Panadería',  'panaderia',  '🥐', 5),
  ('Pizzería',   'pizzeria',   '🍕', 6),
  ('Parrilla',   'parrilla',   '🥩', 7),
  ('Cervecería', 'cerveceria', '🍻', 8)
on conflict (slug) do nothing;

insert into tipos_comida (nombre, slug) values
  ('Argentina',             'argentina'),
  ('Italiana',              'italiana'),
  ('Mexicana',              'mexicana'),
  ('Asiática',              'asiatica'),
  ('Sushi',                 'sushi'),
  ('Vegetariana',           'vegetariana'),
  ('Vegana',                'vegana'),
  ('Sin TACC',              'sin-tacc'),
  ('Saludable',             'saludable'),
  ('Pastas',                'pastas'),
  ('Pizza',                 'pizza'),
  ('Hamburguesas',          'hamburguesas'),
  ('Milanesas',             'milanesas'),
  ('Empanadas',             'empanadas'),
  ('Lomos',                 'lomos'),
  ('Sandwiches',            'sandwiches'),
  ('Wraps',                 'wraps'),
  ('Tacos',                 'tacos'),
  ('Wok',                   'wok'),
  ('Pollo',                 'pollo'),
  ('Pescados y mariscos',   'pescados-mariscos'),
  ('Ensaladas',             'ensaladas'),
  ('Picadas',               'picadas'),
  ('Asado',                 'asado'),
  ('Desayunos',             'desayunos'),
  ('Brunch',                'brunch'),
  ('Tortas y pastelería',   'tortas-pasteleria'),
  ('Café de especialidad',  'cafe-especialidad'),
  ('Tragos',                'tragos'),
  ('Cerveza artesanal',     'cerveza-artesanal')
on conflict (slug) do nothing;
