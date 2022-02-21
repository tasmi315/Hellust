var config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
function preload ()
{
      
    this.load.spritesheet('slime', 'slimebuddy.png', { frameWidth: 32, frameHeight: 32 });  
}

function create ()
{
    player = this.physics.add.sprite(100, 450, 'slime');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('slime', { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('slime', { start: 18, end: 23 }),
        frameRate: 10,
        repeat: -1
    });
        
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('slime', { start: 24, end: 29 }),
        frameRate: 10,
        repeat: -1
    });
        
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('slime', { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'slime', frame: 4 } ],
        frameRate: 20
    });
    
    cursors = this.input.keyboard.createCursorKeys();
        
}
function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.setVelocityY(0);
            
    }
    if (cursors.up.isDown) 
    {
        player.setVelocityY(-160);
            
        player.anims.play('up', true);
    }  
        
    else if (cursors.down.isDown)
    {
        player.setVelocityY(160);
            
        player.anims.play('down', true);
    } 
}