class L6 extends Phaser.Scene{
    constructor(){
        super("L6");
    }

    // preload function
    preload(){
    this.load.image('health', 'assets/images/medicinebox.png');
    this.load.tilemapTiledJSON('map5','assets/maps/L6.json');
    this.load.image('tiles', 'assets/images/Hospital TileSet.png');
    this.load.audio("hit", ["assets/audio/hit.mp3"]);
    this.load.audio("item", ["assets/audio/item.mp3"]);
    this.load.spritesheet('player', 'assets/images/doctor.png', { frameWidth: 53, frameHeight: 44});
    this.load.image('enemy', 'assets/images/enemy.png');
    }
    
    // create function
    create(){
   
    
    
   
    this.enemyMaxX = 150;
    this.enemyMinX = 15;
    this.speed = .5;
    this.score = 0;
    this.scoreText;
    this.hit = this.sound.add("hit");
    this.item = this.sound.add("item");    
    // load map 
    const map5 = this.make.tilemap({key: 'map5'});
    const tileset = map5.addTilesetImage('hospital_tiles', 'tiles');
    this.background = map5.createStaticLayer('background', tileset, 0, 0);
    this.collidables = map5.createStaticLayer('collidables', tileset, 0, 0);
    this.extras = map5.createStaticLayer('extras', tileset, 0, 0);
    this.collidables.setCollisionByExclusion(-1, true);
    this.HealthLayer = map5.getObjectLayer('Health')['objects'];
    
    // add player to the game
    this.player = this.physics.add.sprite(90, 200, 'player', 10);
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);
        
    // setboundaries 
    this.physics.world.setBounds(0, 0, 168, 360);
    this.physics.world.setBoundsCollision();
    
    // add the enemies to the game 
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 3,
        setXY:{
            x: 15,
            y: 65,
            stepX: 0,
            stepY: 92,
        }
    });
           
        
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
    
     // be able to see the medince boxes 
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
    
    // give enemies speed
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
        enemy.speed = Math.random() * 2 + 1;
    }, this);
        
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
    
    if (this.score == 4){
        this.moveOn()
    }
        
    this.movePlayerManager();
        

    // make the enemies move 
    let enemies = this.enemies.getChildren();
    let numEenemies = enemies.length;
    
    for(let i = 0; i < numEenemies; i++){
        enemies[i].x += enemies[i].speed;
        
        
       if(enemies[i].x >= this.enemyMaxX && enemies[i].speed >0){
            enemies[i].speed *= -1;
        }
        else if(enemies[i].x <= this.enemyMinX && enemies[i].speed < 0){
            enemies[i].speed *= -1;
        }
            
        
        // restart the scene 
       if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())){
            this.hit.play();
            deathCount.count += 1;
            this.isPlayerAlive = false;
            this.cameras.main.shake(500);
    
            this.time.delayedCall(250, function(){
                this.cameras.main.fade(250);
            }, [], this);
    
            this.time.delayedCall(500, function(){
                this.scene.restart();
            }, [], this);
            break;
        }
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
    
    moveOn() {
        this.scene.start("YouWon")
    }
    
}