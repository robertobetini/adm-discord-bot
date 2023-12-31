const Discord = require("discord.js");
const RoleService = require("../../services/roleService");
const Role = require("../../models/role");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("cargoadm")
        .setDescription("Define o cargo de ADM")
        .addRoleOption(option =>
			option
				.setName("cargo")
				.setDescription("O cargo que será considerado como ADM pelo bot")
				.setRequired(true)),
    async execute(interaction) {
        try {
            const role = interaction.options.getRole("cargo");
    
            if (interaction.user.id !== interaction.guild.ownerId) {
                await interaction.reply("Apenas o dono do servidor pode alterar o cargo de ADM.");
            }
            
            const admRole = new Role(interaction.guild.id, role.id, Role.ADM_TYPE);
            await RoleService.upsert(admRole);
            await interaction.reply("Cargo de ADM alterado com sucesso.");
        } catch(err) {
            await interaction.reply(err.message);
        }
    }
}
