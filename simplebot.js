const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'pigfish.aternos.host',
        port: 64109,
        username: 'ExplorerBot',
        version: false
    });

    // Carregar o plugin de pathfinding
    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('Bot logado e pronto para explorar mais longe!');
        exploreRandomly(bot);
    });

    bot.on('end', createBot);
    bot.on('kicked', (reason) => console.log('Bot foi expulso:', reason));
    bot.on('error', console.error);

    bot.on('physicTick', () => {
        if (!bot.pathfinder.isMoving() && bot.pathfinder.goal) {
            console.log("Parece que estou preso, tentando pular!");
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 300); // Pula e para após 300ms
        }
    });
}

function exploreRandomly(bot) {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    setInterval(() => {
        // Escolhe um ponto aleatório a uma distância maior
        const range = 500; // Aumente o alcance para explorar mais longe
        const randomX = bot.entity.position.x + (Math.random() - 0.5) * range * 2;
        const randomZ = bot.entity.position.z + (Math.random() - 0.5) * range * 2;
        const goal = new goals.GoalXZ(randomX, randomZ);

        console.log(`Movendo para nova posição: X=${randomX.toFixed(0)}, Z=${randomZ.toFixed(0)}`);
        bot.pathfinder.setGoal(goal, true);
    }, 30000); // Aumenta o intervalo se necessário para permitir que o bot chegue ao destino
}

createBot();
