class Controls extends Phaser.Scene{
    constructor(){
        super("Controls");
    }
    
    preload(){
        this.load.image('controls', 'assets/images/controlsbg.png');
        this.load.image('play', 'assets/images/play.png');
    }
    
    create(){
        let playButton = this.add.image(this.game.renderer.width / 1.15, this.game.renderer.height / 1.1, 'play').setDepth(1);
        
        this.add.image(0,0, 'controls').setOrigin(0);
        
        playButton.setInteractive();
        
        playButton.on('pointerdown', ()=>{
            this.scene.start("L1")
        })

        


    }
    
    

        
}