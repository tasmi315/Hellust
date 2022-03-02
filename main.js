var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    
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
var map;
var player;
var background;
var tileset;
var furniture;
var wall_furniture;

function preload ()
{
      
    this.load.image('tiles', 'Hospital TileSet.png');
    this.load.tilemapTiledJSON('map','hallway.json');
    this.load.spritesheet('doctor', 'doctorp.png', { frameWidth: 24, frameHeight: 27 });  
}

function create ()
{ 
    
    // adding background to the game 
    map = this.make.tilemap({key: 'map'});
    tileset = map.addTilesetImage('hospital_tiles', 'tiles');
    tileset = map.addTilesetImage('hospital_tiles', 'tiles');
    background = map.createStaticLayer('Background', tileset, 0, 0);
    furniture = map.createStaticLayer('Furniture', tileset, 0, 0);
    wall_furniture = map.createStaticLayer('Wall furniture', tileset, 0, 0);
    

    
    
    // Adding the doctor into the scene 
    player = this.physics.add.sprite(100, 450, 'doctor');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    
    
    
    
    
    
    
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('doctor', { start: 5, end: 9 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('doctor', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
        
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('doctor', { start: 10, end: 14 }),
        frameRate: 10,
        repeat: -1
    });
        
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('doctor', { start: 15, end: 19 }),
        frameRate: 10,
        repeat: -1
    });
    
   /* this.anims.create({
        key: 'turn',
        frames: [ { key: 'doctor', frame: 10 } ],
        frameRate: 20
    });*/
    
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