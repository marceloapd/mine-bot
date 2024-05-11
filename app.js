const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const minecraftData = require('minecraft-data');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'pigfish.aternos.host',
        port: 64109,
        username: 'BotExplorer',
        version: false
    });

    bot.loadPlugin(pathfinder);

    bot.on('spawn', initializeBot);
    bot.on('chat', handleChatCommand);
    bot.on('end', handleReconnect);
    bot.on('kicked', reason => console.log('Bot foi expulso:', reason));
    bot.on('error', console.error);
}

function initializeBot() {
    console.log('Bot logado e pronto para explorar e gerenciar itens!');
    this.mcData = minecraftData(this.version);
    this.pathfinder.setMovements(new Movements(this, this.mcData));
    this.findHostiles = setInterval(() => detectAndCombatHostiles(this), 5000);
    startSafeExploration(this);
}

function handleChatCommand(username, message) {
    const [command, ...params] = message.split(' ');
    switch (command) {
        case 'equip':
            equipItem(this, params.join(' '));
            break;
        case 'use':
            useItem(this, params.join(' '));
            break;
        case 'follow':
            followPlayer(this, username);
            break;
        case 'help':
            executeHelp(this, params[0]);
            break;
        case 'attack':
            this.findHostiles = setInterval(() => detectAndCombatHostiles(this), 5000);
            console.log('Detecção de hostis Ativada.');
            break;
        case 'stop':
            clearInterval(this.findHostiles);
            console.log('Detendo a detecção de hostis.');
            break;
    }
}

function handleReconnect() {
    console.log('Bot desconectado. Tentando reconectar...');
    createBot();
}

function startSafeExploration(bot) {
    setInterval(() => {
        if (bot.health < 10) {
            seekSafety(bot);
        } else {
            exploreRandomly(bot);
        }
    }, 10000);
}

function detectAndCombatHostiles(bot) {
    const hostiles = Object.values(bot.entities).filter(entity => 
        entity.displayName && !entity.passive && bot.entity.position.distanceTo(entity.position) < 16);

    if (hostiles.length > 0) {
        const target = hostiles[0]; // Pega o primeiro mob hostil encontrado
        bot.pathfinder.setGoal(new goals.GoalNear(target.position.x, target.position.y, target.position.z, 1));
        equipItem(bot, 'sword'); // Equipa uma espada automaticamente
        console.log('Engajando com mob hostil:', target.displayName);
        bot.once('goal_reached', () => attackMob(bot, target));
    }
}

function attackMob(bot, target) {
    if (target && bot.entity.position.distanceTo(target.position) < 2) {
        bot.attack(target);
        console.log('Atacando:', target.displayName);
    }
}


function seekSafety(bot) {
    const safePlace = bot.findBlock({
        matching: block => bot.mcData.blocksByName.air.id === block.type,
        maxDistance: 64
    });
    if (safePlace) {
        bot.pathfinder.setGoal(new goals.GoalBlock(safePlace.position.x, safePlace.position.y, safePlace.position.z));
        console.log('Buscando um lugar seguro...');
    }
}

function exploreRandomly(bot) {
    const goal = generateRandomGoal(bot.entity.position, 500);
    console.log(`Explorando nova posição: X=${goal.x.toFixed(0)}, Z=${goal.z.toFixed(0)}`);
    bot.pathfinder.setGoal(goal, true);
}

function generateRandomGoal(position, range) {
    const randomX = position.x + (Math.random() - 0.5) * range * 2;
    const randomZ = position.z + (Math.random() - 0.5) * range * 2;
    return new goals.GoalXZ(randomX, randomZ);
}

function equipItem(bot, itemName) {
    const itemType = getItemType(itemName);
    const item = bot.inventory.items().find(it => it.name.includes(itemName));

    if (item) {
        bot.equip(item, itemType, err => {
            if (err) {
                console.log(`Não foi possível equipar ${item.name}:`, err);
            } else {
                console.log(`Equipado ${item.name} com sucesso.`);
            }
        });
    } else {
        console.log(`Item ${itemName} não encontrado no inventário.`);
    }
}

function useItem(bot, itemName) {
    const item = bot.inventory.items().find(it => it.name.includes(itemName));

    if (item) {
        bot.equip(item, 'hand', err => {
            if (err) {
                console.log(`Não foi possível equipar ${item.name} para uso:`, err);
            } else {
                bot.activateItem();
                console.log(`Usando ${item.name}.`);
            }
        });
    } else {
        console.log(`Item ${itemName} não encontrado no inventário.`);
    }
}

function followPlayer(bot, playerName) {
    const player = bot.players[playerName] ? bot.players[playerName].entity : null;
    if (player) {
        bot.pathfinder.setGoal(new goals.GoalFollow(player, 1), true);
        console.log(`Seguindo o jogador ${playerName}.`);
    } else {
        console.log(`Jogador ${playerName} não encontrado.`);
    }
}

function executeHelp(bot, command) {
    const commands = {
        equip: 'Para equipar um item, digite "equip [item]". Exemplo: "equip sword".',
        use: 'Para usar um item, digite "use [item]". Exemplo: "use apple".',
        follow: 'Para seguir um jogador, digite "follow [nome do jogador]".',
        help: 'Para obter ajuda sobre um comando, digite "help [comando]".'
    };

    const helpMessage = commands[command] || 'Comando desconhecido. Use "help [comando]" para obter ajuda sobre um comando específico.';
    console.log(helpMessage);
}

function getItemType(itemName) {
    if (['sword', 'pickaxe', 'axe'].some(tool => itemName.includes(tool))) {
        return 'hand';
    } else if (itemName.includes('helmet')) {
        return 'head';
    } else if (itemName.includes('chestplate')) {
        return 'torso';
    } else if (itemName.includes('leggings')) {
        return 'legs';
    } else if (itemName.includes('boots')) {
        return 'feet';
    }
    return 'hand'; // Default case for other items
}

createBot();
