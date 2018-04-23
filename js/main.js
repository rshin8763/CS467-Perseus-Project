var Perseus = Perseus || {};

Perseus.game = new Phaser.Game(320, 320, Phaser.AUTO, '');

Perseus.game.state.add('Boot', Perseus.Boot);
Perseus.game.state.add('Preload', Perseus.Preload);
Perseus.game.state.add('Game', Perseus.Game);

Perseus.game.state.start('Boot');
