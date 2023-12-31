const Discord = require("discord.js");

const RoleService = require("../../services/roleService");
const TimerService = require("./../../services/timerService");
const StatusService = require("./../../services/statusService");
const Role = require("./../../models/role");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("retirartempo")
        .setDescription("Silencia o usuário por um período de tempo")
        .addUserOption(option =>
			option
				.setName("user")
				.setDescription("O usuário que será silenciado")
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName("dias")
				.setDescription("Quantidade de dias em silêncio")
                .setMinValue(0))
        .addIntegerOption(option =>
            option
                .setName("horas")
                .setDescription("Quantidade de horas em silêncio")
                .setMinValue(0))
        .addIntegerOption(option =>
            option
                .setName("minutos")
                .setDescription("Quantidade de minutos em silêncio")
                .setMinValue(0)),
    async execute(interaction) {
        try {
            if (!await RoleService.isMemberAdm(interaction.guild, interaction.member)) {
                interaction.reply("Você não possui cargo de ADM para executar o comando.");
                return;
            };
            
            const target = interaction.options.getUser("user");
            const days = interaction.options.getInteger("dias");
            const hours = interaction.options.getInteger("horas");
            const minutes = interaction.options.getInteger("minutos");

            if (days < 1 && hours < 1 && minutes < 1) {
                await interaction.reply("Insira um período de tempo válido.");
                return;
            }

            await TimerService.removeSilenceTime(interaction.guild.id, target, days, hours, minutes);

            var message = `Tempo de silenciamento atualizado para ${Discord.userMention(target.id)}.\n` +
                await StatusService.getUserStatus(interaction.guild.id, target);

            await interaction.reply(message);
        } catch(err) {
            await interaction.reply(err.message);
        }
    }
}
