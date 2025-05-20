/**
 * 20250513213550_init_schema.js
 */

exports.up = async function(knex) {
  // 1) Cria ENUMs só se não existirem
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('cliente', 'entregador');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'modalidade') THEN
        CREATE TYPE modalidade AS ENUM ('venda', 'doacao');
      END IF;
    END
    $$;
  `);

  // 2) Tabela de usuários
  await knex.schema.createTable('usuario', table => {
    table.string('cpf', 11).primary();
    table.string('nome_completo', 80).notNullable();
    table.string('apelido', 80).notNullable().unique();
    table.date('data_nascimento').notNullable();
    table.string('telefone', 15).notNullable().unique();
    table.timestamp('data_registro', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.string('email', 256).notNullable().unique();
    table.string('senha_hash', 60).notNullable();
    table
      .specificType('role', 'user_role')
      .notNullable()
      .defaultTo('cliente');
  });

  // 3) Categorias de entulho
  await knex.schema.createTable('categoria_entulho', table => {
    table.increments('id').primary();
    table.specificType('classificacao', 'CHAR(1)').notNullable().unique();
    table.text('descricao').notNullable().unique();
  });

  // 4) Anúncios de entulho
  await knex.schema.createTable('entulho', table => {
    table.increments('id').primary();
    table.string('cpf_autor', 11).notNullable()
        .references('cpf').inTable('usuario')
        .onDelete('CASCADE');
    table.string('titulo', 80).notNullable();
    table.text('descricao').notNullable();
    table.text('localizacao').notNullable();
    table.decimal('latitude', 9, 6);
    table.decimal('longitude', 9, 6);
    table.integer('categoria_id').notNullable()
        .references('id').inTable('categoria_entulho')
        .onDelete('CASCADE');
    table.text('detalhes_tipo');
    table.decimal('volume', 10, 2);
    table.decimal('preco', 10, 2);
    table
      .specificType('transacao', 'modalidade')
      .notNullable()
      .defaultTo('doacao');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // 5) Trigger para manter updated_at atualizado
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_entulho_updated_at ON entulho;
    CREATE TRIGGER trg_entulho_updated_at
      BEFORE UPDATE ON entulho
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `);

  // 6) Imagens de entulho
  await knex.schema.createTable('imagem_entulho', table => {
    table.increments('id').primary();
    table.integer('entulho_id').notNullable()
         .references('id').inTable('entulho')
         .onDelete('CASCADE');
    table.string('imagem_url', 2048).notNullable();
  });

  // 7) Salvos
  await knex.schema.createTable('salvo', table => {
    table.string('cpf_usuario', 11).notNullable()
         .references('cpf').inTable('usuario')
         .onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('entulho_id').notNullable()
         .references('id').inTable('entulho')
         .onDelete('CASCADE').onUpdate('CASCADE');
    table.primary(['cpf_usuario','entulho_id']);
  });

  // 8) Compras
  await knex.schema.createTable('compra', table => {
    table.string('comprador_cpf', 11).notNullable()
         .references('cpf').inTable('usuario')
         .onDelete('CASCADE').onUpdate('CASCADE');
    table.string('vendedor_cpf', 11).notNullable()
         .references('cpf').inTable('usuario')
         .onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('entulho_id').notNullable()
         .references('id').inTable('entulho')
         .onDelete('CASCADE').onUpdate('CASCADE');
    table.timestamp('data_compra', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.decimal('preco', 10, 2).notNullable();
    table.decimal('frete', 10, 2).notNullable();
    table.decimal('preco_total', 10, 2).notNullable();
    table.primary(['comprador_cpf','vendedor_cpf','entulho_id']);
  });

  // 9) Reportes de entulho perdido
  await knex.schema.createTable('lost_report', table => {
    table.increments('id').primary();
    table.string('entregador_cpf', 11).notNullable()
         .references('cpf').inTable('usuario')
         .onDelete('CASCADE').onUpdate('CASCADE');
    table.text('localizacao').notNullable();
    table.text('descricao').notNullable();
    table.timestamp('data_report', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // 10) Posts do blog
  await knex.schema.createTable('blog_post', table => {
    table.increments('id').primary();
    table.string('autor_cpf', 11)
         .references('cpf').inTable('usuario')
         .onDelete('SET NULL');
    table.string('title', 150).notNullable();
    table.text('excerpt').notNullable();
    table.text('content').notNullable();
    table.string('image_url', 2048);
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // Trigger updated_at para blog_post
  await knex.raw(`
    CREATE OR REPLACE FUNCTION trg_update_blogpost_updated_at()
      RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS blogpost_updated_at ON blog_post;
    CREATE TRIGGER blogpost_updated_at
      BEFORE UPDATE ON blog_post
      FOR EACH ROW
      EXECUTE FUNCTION trg_update_blogpost_updated_at();
  `);

  // 11) Notificações
  await knex.schema.createTable('notificacao', table => {
    table.increments('id').primary();
    table.string('usuario_cpf', 11)
         .references('cpf').inTable('usuario')
         .onDelete('CASCADE');
    table.text('mensagem').notNullable();
    table.boolean('lida').notNullable().defaultTo(false);
    table.timestamp('criado_em', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.integer('entulho_id').references('id').inTable('entulho');
  });

  // 12) Chat
  await knex.schema.createTable('chat_message', table => {
    table.increments('id').primary();
    table.integer('entulho_id').notNullable()
         .references('id').inTable('entulho').onDelete('CASCADE');
    table.string('remetente_cpf', 11).notNullable()
         .references('cpf').inTable('usuario');
    table.text('texto').notNullable();
    table.timestamp('enviado_em', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // 13) Índices para performance
  await knex.raw(`
    CREATE INDEX idx_entulho_categoria      ON entulho(categoria_id);
    CREATE INDEX idx_entulho_created        ON entulho(created_at);
    CREATE INDEX idx_entulho_preco          ON entulho(preco);
    CREATE INDEX idx_lostreport_entregador  ON lost_report(entregador_cpf);
  `);
};

exports.down = async function(knex) {
  // Drop triggers e functions primeiro (importante para não dar erro de referência)
  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_entulho_updated_at ON entulho;
    DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
    DROP TRIGGER IF EXISTS blogpost_updated_at ON blog_post;
    DROP FUNCTION IF EXISTS trg_update_blogpost_updated_at CASCADE;
  `);

  // Drop as tabelas na ordem inversa da criação (respeitando dependências)
  await knex.schema.dropTableIfExists('chat_message');
  await knex.schema.dropTableIfExists('notificacao');
  await knex.schema.dropTableIfExists('blog_post');
  await knex.schema.dropTableIfExists('lost_report');
  await knex.schema.dropTableIfExists('compra');
  await knex.schema.dropTableIfExists('salvo');
  await knex.schema.dropTableIfExists('imagem_entulho');
  await knex.schema.dropTableIfExists('entulho');
  await knex.schema.dropTableIfExists('categoria_entulho');
  await knex.schema.dropTableIfExists('usuario');

  // Drop enums por último
  await knex.raw(`
    DROP TYPE IF EXISTS modalidade;
    DROP TYPE IF EXISTS user_role;
  `);

  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_entulho_updated_at ON entulho;
    DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
    DROP TRIGGER IF EXISTS blogpost_updated_at ON blog_post;
    DROP FUNCTION IF EXISTS trg_update_blogpost_updated_at CASCADE;
    DROP TYPE IF EXISTS modalidade;
    DROP TYPE IF EXISTS user_role;
  `);
};