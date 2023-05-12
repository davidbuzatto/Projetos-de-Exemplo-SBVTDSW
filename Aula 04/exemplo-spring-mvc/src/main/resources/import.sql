-- as importações durante o desenvolvimento serão feitas com codificação
-- errada. em produção os dados serão armazenados corretamente.

delete from cidade;
delete from estado;

INSERT INTO estado(id, nome, sigla) VALUES(1, 'São Paulo', 'SP');
INSERT INTO estado(id, nome, sigla) VALUES(2, 'Minas Gerais', 'MG');
INSERT INTO estado(id, nome, sigla) VALUES(3, 'Paraná', 'PR');

INSERT INTO cidade(id, nome, estado_id) VALUES(1, 'Vargem Grande do Sul', 1);
INSERT INTO cidade(id, nome, estado_id) VALUES(2, 'São João da Boa Vista', 1);
INSERT INTO cidade(id, nome, estado_id) VALUES(3, 'Poços de Caldas', 2);
INSERT INTO cidade(id, nome, estado_id) VALUES(4, 'Curitiba', 3);