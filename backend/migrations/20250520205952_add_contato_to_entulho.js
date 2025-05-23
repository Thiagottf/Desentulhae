exports.up = async function(knex) {
await knex.schema.alterTable('entulho', table => {
    table.string('contato', 80);
});
};

exports.down = async function(knex) {
await knex.schema.alterTable('entulho', table => {
    table.dropColumn('contato');
});
};
