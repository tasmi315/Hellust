var config = {
    type: Phaser.AUTO,
    width: 288,
    height: 288,
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,   
    },
    scale: {
      zoom: 2
    }

    
};

var game = new Phaser.Game(config);
var map;
var player;
var background;
var tileset;
var furniture;
var wall_furniture;
var health;
var HealthLayer;
var healthScore = 0;

function preload ()
{
    this.load.image('health', 'medicinebox.png');
    this.load.image('tiles', 'Hospital TileSet.png');
    this.load.tilemapTiledJSON('map','hallway.json');
    this.load.spritesheet('doctor', 'doctor.png', { frameWidth: 53, frameHeight: 44}); 
    
}

function create ()
{ 
    
    // adding background to the game 
    map = this.make.tilemap({key: 'map'});
    tileset = map.addTilesetImage('hospital_tiles', 'tiles');
    background = map.createStaticLayer('Background', tileset, 0, 0);
    furniture = map.createStaticLayer('Furniture', tileset, 0, 0);
    wall_furniture = map.createStaticLayer('Wall furniture', tileset, 0, 0);
    furniture.setCollisionByExclusion(-1, true);
    HealthLayer = map.getObjectLayer('Health')['objects'];
    

    
    
    // Adding the doctor into the scene 
    player = this.physics.add.sprite(100, 100, 'doctor');
    //player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    //this.physics.add.overlap(player, health, collectMushroom, null, this);
    

    
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('doctor', { start: 4, end: 6}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('doctor', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });
        
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('doctor', { start: 9, end: 11 }),
        frameRate: 6,
        repeat: -1
    });
        
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('doctor', { start: 12, end: 19 }),
        frameRate: 6,
        repeat: -1
    });
    
    
    cursors = this.input.keyboard.createCursorKeys();
    
    
    
    health = this.physics.add.staticGroup()
    //this is how we actually render our coin object with coin asset we loaded into our game in the preload function
    HealthLayer.forEach(object => {
    let obj = health.create(object.x, object.y, "health"); 
       obj.setOrigin(0); 
       obj.body.width = object.width; 
       obj.body.height = object.height; 
});
    //score
    text = this.add.text(0, 0, `Health: ${healthScore}x`, {
      fontSize: '15px',
      fill: '#ffffff'
    });
    text.setScrollFactor(0);
    
    
    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, furniture);
    this.physics.add.overlap(player, health, collectHealth, null, this);
        
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
function collectHealth(player, health) {
    health.disableBody(true, true);
    healthScore ++;
    text.setText(`Health: ${healthScore}x`); 
    
}