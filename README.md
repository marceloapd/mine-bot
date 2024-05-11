# Documentação do Bot Minecraft

Este bot é uma implementação automática que utiliza a biblioteca `mineflayer` juntamente com o plugin `mineflayer-pathfinder` para interagir com o mundo do Minecraft. Abaixo, você encontrará detalhes sobre as funcionalidades do bot, incluindo comandos disponíveis e comportamentos automáticos.

## Funcionalidades

O bot possui várias capacidades, incluindo exploração automática, gestão de inventário, combate a mobs hostis, e interação com jogadores.

### Exploração

O bot é capaz de explorar o mundo de Minecraft automaticamente. Ele muda sua direção aleatoriamente a cada 30 segundos para explorar novas áreas.

### Detecção e Combate a Mobs Hostis

O bot verifica periodicamente a presença de mobs hostis num raio de 16 blocos. Ao detectar um mob hostil, ele automaticamente equipa uma espada e se dirige ao mob para atacá-lo.

### Gestão de Inventário

O bot pode equipar e usar itens do inventário com base em comandos específicos.

### Interatividade com Jogadores

O bot pode seguir jogadores específicos e responder a comandos enviados via chat do jogo.

## Comandos

O bot responde aos seguintes comandos enviados através do chat do Minecraft:

- **equip [item]**: Equipa um item especificado pelo nome. Por exemplo, `equip sword`.
- **use [item]**: Usa um item especificado pelo nome, como comer uma maçã.
- **follow [player name]**: Segue o jogador especificado.
- **help [command]**: Fornece ajuda sobre um comando específico.
- **attack**: Ativa combate automático a mobs hostis.
- **stop**: Detém a detecção e o combate automático a mobs hostis.

## Comportamento Automático

### Segurança

Quando a saúde do bot cai abaixo de 10, ele busca um local seguro para evitar mais danos.

### Reconexão

Se o bot for desconectado, ele tentará reconectar-se automaticamente.

## Instalação e Configuração

Para usar este bot, você precisa instalar as bibliotecas `mineflayer`, `mineflayer-pathfinder` e `minecraft-data` usando npm:

```bash
npm install mineflayer mineflayer-pathfinder minecraft-data
