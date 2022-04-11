class L5 extends Phaser.Scene{
    constructor(){
        super("L5");
    }

    // preload function
    preload(){
    
    this.load.image('health', 'assets/images/medicinebox.png');
    this.load.tilemapTiledJSON('map2','assets/maps/L3.json');
    this.load.image('tiles', 'assets/images/Hospital TileSet.png');
    this.load.audio("hit", ["assets/audio/hit.mp3"]);
    this.load.audio("item", ["assets/audio/item.mp3"]);
    this.load.spritesheet('player', 'assets/images/doctor.png', { frameWidth: 53, frameHeight: 44});
    this.load.image('enemy', 'assets/images/enemy.png');
    }
    
    // create function
    create(){

    
    this.evSpeed = 60;
    this.evSpeed2 = 60;
    this.ehSpeed = 60;
    this.score = 0;
    this.scoreText;
    this.hit = this.sound.add("hit");
    this.item = this.sound.add("item");
    
        
    // load map 
    const map2 = this.make.tilemap({key: 'map2'});
    const tileset = map2.addTilesetImage('hospital_tiles', 'tiles');
    this.background = map2.createStaticLayer('background', tileset, 0, 0);
    this.collidables = map2.createStaticLayer('collidables', tileset, 0, 0);
    this.extras = map2.createStaticLayer('extras', tileset, 0, 0);
    this.collidables.setCollisionByExclusion(-1, true);
    this.HealthLayer = map2.getObjectLayer('Health')['objects'];
    
    // add player to the game
    this.player = this.physics.add.sprite(260, 100, 'player', 10);
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);
    
    // setboundaries 
    this.physics.world.setBounds(0, 0, 288, 312);
    this.physics.world.setBoundsCollision();
        
    
    // add enemies to the level 
    this.enemy1 = this.physics.add.sprite(45, 150, 'enemy', 10);
    this.enemy1.setScale(0.8);
    this.enemy1.setVelocityY(this.evSpeed)
    
    this.enemy2 = this.physics.add.sprite(115, 150, 'enemy', 10);
    this.enemy2.setScale(0.8);
    this.enemy2.setVelocityY(this.evSpeed)
    
    let timedEvent1 = this.time.addEvent({delay: 2500, callback: this.vMove, callbackScope: this, loop: true});
    
    this.enemy3 = this.physics.add.sprite(30, 150, 'enemy', 10);
    this.enemy3.setScale(0.8);
    this.enemy3.setVelocityX(this.ehSpeed)
    
    this.enemy4 = this.physics.add.sprite(30, 228, 'enemy', 10);
    this.enemy4.setScale(0.8); 
    this.enemy4.setVelocityX(this.ehSpeed)
        
    let timedEvent2 = this.time.addEvent({delay: 3900, callback: this.hMove, callbackScope: this, loop: true}); 
    
    // Adding the enemy sprites to the scene 
    this.enemy5 = this.physics.add.sprite(188, 228, 'enemy', 10);
    this.enemy5.setScale(0.8);
    this.enemy5.setVelocityY(this.evSpeed2);
    
    this.enemy6 = this.physics.add.sprite(258, 228, 'enemy', 10);
    this.enemy6.setScale(0.8);
    this.enemy6.setVelocityY(this.evSpeed2);
    
 
    let timedEvent3 = this.time.addEvent({delay: 1200, callback: this.vMove2, callbackScope: this, loop: true});
        
        
    // player animations 
    this.cursors = this.input.keyboard.createCursorKeys();
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });
        
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
        frameRate: 6,
        repeat: -1
    });
        
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 12, end: 19 }),
        frameRate: 6,
        repeat: -1
    });
    
     // be able to see the boxes 
    this.health = this.physics.add.staticGroup()
    this.HealthLayer.forEach(object => {
    let obj = this.health.create(object.x, object.y, "health"); 
       obj.setOrigin(0); 
       obj.body.width = object.width; 
       obj.body.height = object.height; 
});  
        
    // score on screen 
    //this.scoreText = this.add.text(89, 10, 'Boxes Collected: 0', { fontSize: '10px', fill: 'white' })
    
    // player is not dead    
    this.isPlayerAlive = true;  
        
    // collisions
    this.physics.add.collider(this.player, this.collidables);
    this.physics.add.overlap(this.player, this.health, this.collectHealth, null, this);
    
    this.time.addEvent({
        delay:100,
        callback: this.delayDone,
        callbackScope:this,
        loop: false,
    });
    }
    
    // update function
    update(){
    
    // continue if the player is alive 
    if(!this.isPlayerAlive){
        return;
    }
    
    // move onto the next level 
    if (this.score == 5){
        this.moveOn()
    }
    this.movePlayerManager();
        
    // collisions with the enemy 
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy1.getBounds())){
        this.restart()
    }
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy2.getBounds())){
        this.restart()
    }
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy3.getBounds())){
        this.restart()
    }
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy4.getBounds())){
        this.restart()
    }
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy5.getBounds())){
        this.restart()
    }
       
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy6.getBounds())){
        this.restart()
    }
        
    }
    
    delayDone()
    {
        this.player.body.setSize(30, 44, false);
    }
    movePlayerManager(){
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-gameSettings.playerSpeed);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(gameSettings.playerSpeed);
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            
        }
        if (this.cursors.up.isDown) 
        {
            this.player.setVelocityY(-gameSettings.playerSpeed);
            this.player.anims.play('up', true);
        }  
        
        else if (this.cursors.down.isDown)
        {   
            this.player.setVelocityY(gameSettings.playerSpeed);
            this.player.anims.play('down', true);
        } 
    }

    collectHealth(player, health) {
        this.item.play();
        health.disableBody(true,true);
        this.score++;
        
    }

    hMove() {
        this.ehSpeed *= -1;
        this.enemy3.setVelocityX(this.ehSpeed);
        this.enemy4.setVelocityX(this.ehSpeed);
        
    }
    
    vMove() {
        this.evSpeed *= -1;
        this.enemy1.setVelocityY(this.evSpeed);
        this.enemy2.setVelocityY(this.evSpeed);
    }
    
    vMove2() {
        this.evSpeed2 *= -1;
        this.enemy5.setVelocityY(this.evSpeed2);
        this.enemy6.setVelocityY(this.evSpeed2);
        
    }
    
    
    restart() {
        this.hit.play();
        deathCount.count += 1;
        this.isPlayerAlive = false;
        this.cameras.main.shake(500);
    
        this.time.delayedCall(250, function(){
            this.cameras.main.fade(250);
            }, [], this);
    
        this.time.delayedCall(500, function(){
            this.scene.restart();
            this.evSpeed = 60;
            this.ehSpeed = -60;
            }, [], this);
        
    }
    moveOn() {
        this.scene.start("L6")
    }
    
}