exports.up = async function(knex) {
await knex.schema.alterTable('imagem_entulho', table => {
    table.text('imagem_url').alter();
});
};

exports.down = async function(knex) {
await knex.schema.alterTable('imagem_entulho', table => {
    table.string('imagem_url', 2048).alter();
});
};
