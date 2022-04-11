class L3 extends Phaser.Scene{
    constructor(){
        super("L3");
    }

    // preload function
    preload(){
    
    this.load.image('health', 'assets/images/medicinebox.png');
    this.load.tilemapTiledJSON('map','assets/maps/L1.json');
    this.load.image('tiles', 'assets/images/Hospital TileSet.png');
    this.load.audio("hit", ["assets/audio/hit.mp3"]);
    this.load.audio("item", ["assets/audio/item.mp3"]);
    this.load.spritesheet('player', 'assets/images/doctor.png', { frameWidth: 53, frameHeight: 44});
    this.load.image('enemy', 'assets/images/enemy.png');
    }
    
    // create function
    create(){

    this.enemyMaxY = 275;
    this.enemyMinY = 150;
    this.speed = .5;
    this.score = 0;
    this.scoreText;
    
    this.hit = this.sound.add("hit");
    this.item = this.sound.add("item");
    // load map
       
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('hospital_tiles', 'tiles');
    this.background = map.createStaticLayer('background', tileset, 0, 0);
    this.collidables = map.createStaticLayer('collidables', tileset, 0, 0);
    this.extras = map.createStaticLayer('extras', tileset, 0, 0);
    this.collidables.setCollisionByExclusion(-1, true);
   
        
    // add player to the game 
    this.player = this.physics.add.sprite(40, 200, 'player', 10);
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);
        
    // setboundaries 
    this.physics.world.setBounds(0, 0, 600, 312);
    this.physics.world.setBoundsCollision();
        
        
    this.cursors = this.input.keyboard.createCursorKeys();
        
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6}),
        frameRate: 6,
        repeat: -1
    });

    // player animations 
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
    
    // make the medicine box appear 
    this.health = this.add.sprite(this.sys.game.config.width - 20, this.sys.game.config.height / 2, 'health');
    
    // add the enemies to the game 
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 5,
        setXY:{
            x: 110,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });
    
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
        enemy.speed = Math.random() * 2 + 1;
    }, this);
    
    //this.scoreText = this.add.text(16, 310, 'Score: 0', { fontSize: '22px', fill: 'red' })
    

    this.isPlayerAlive = true;
    
    // collisions
    this.physics.add.collider(this.player, this.collidables);
        
    this.cameras.main.resetFX();

    this.time.addEvent({
        delay:100,
        callback: this.delayDone,
        callbackScope:this,
        loop: false,
    });
    }
    
    // update function
    update(){
    if(!this.isPlayerAlive){
        return;
    }
    

    this.movePlayerManager();
    
        
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.health.getBounds())){
        this.item.play();
        this.health.destroy();
        //this.score = 10;
        //this.scoreText.setText('Score:' + this.score.toString());
        this.scene.start("L4");
        
    }
    
    
    // make the enemies move 
    let enemies = this.enemies.getChildren();
    let numEenemies = enemies.length;
    
    for(let i = 0; i < numEenemies; i++){
        enemies[i].y += enemies[i].speed;
        
        if(enemies[i].y >= this.enemyMaxY && enemies[i].speed >0){
            enemies[i].speed *= -1;
        }
        else if(enemies[i].y <= this.enemyMinY && enemies[i].speed < 0)
            enemies[i].speed *= -1;
        
        // restart the scene 
        if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())){
            deathCount.count += 1;
            this.hit.play();
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
    // making the player move 
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
        
}