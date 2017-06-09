var event = new CustomEvent("playerDies", { "detail": "Example of an event" });

function Player(){
    this.hp = 100;
    this.sprite = new Sprite();
    this.vidas = 3;
    this.pontos = 0;
    this.x = 40;
    this.y = 350;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.ay = 0.0;
    this.sprite.vy = 0.0;
    this.shots = [];
    this.cooldown = 0;
    this.colisionObservable = null;
    this.alive = true;
    this.fireButton = 13;
    this.leftButton = 37;
    this.downButton = 38;
    this.rightButton = 39;
    this.upButton = 40;
}


Player.prototype.desenhar = function(ctx){this.sprite.desenhar(ctx)};

Player.prototype.desenharImg = function(ctx, img){
    this.sprite.desenharImg(ctx, img);
    for (var i = 0; i < this.shots.length; i++) {
        this.shots[i].desenharImg(ctx, this.imageLib.images[this.shots[i].sprite.imgkey]);
    }
};

Player.prototype.mover = function(dt){
    this.sprite.mover(dt);
    this.moverTiros(dt);
    if(this.cooldown>0) {
        this.cooldown -= dt;
    } else {
        this.cooldown = 0;
    }
};
Player.prototype.moverTiros = function(dt){
    for (var i = this.shots.length - 1; i >= 0; i--) {
        this.shots[i].moverAng(dt);
        if (
            this.shots[i].sprite.x > 3000 ||
            this.shots[i].sprite.x < -3000 ||
            this.shots[i].sprite.y > 3000 ||
            this.shots[i].sprite.y < -3000
        ) {
            this.shots.splice(i, 1);
        }
    }
};

Player.prototype.moverAng = function(dt){
    this.moverTiros(dt);
    this.sprite.moverAng(dt);
    if(this.cooldown>0) {
        this.cooldown -= dt;
    } else {
        this.cooldown = 0;
    }
};

Player.prototype.colidiuCom = function(alvo){
    this.sprite.colidiuCom(alvo);
};

Player.prototype.perseguir = function (alvo, dt) {this.sprite.perseguir(alvo, dt)};
Player.prototype.perseguirAng = function (alvo, dt){this.sprite.perseguirAng(alvo, dt)};

Player.prototype.removeShot = function (shot){
    x = this.shots.indexOf(shot);
    this.colisionObservable.remove(shot);
    this.shots = this.shots.splice(x, 1);
};

Player.prototype.fire = function (audiolib, key, vol){
    console.log(this.cooldown);
    if(this.cooldown>0) return;
    var tiro = new Shot();
    tiro.sprite.x = this.sprite.x;
    tiro.sprite.y = this.sprite.y;
    tiro.sprite.angle = this.sprite.angle;
    tiro.sprite.am = 100;
    tiro.sprite.width = 8;
    tiro.sprite.height = 16;
    tiro.sprite.imgkey = "shot";
    this.shots.push(tiro);
    this.colisionObservable.add(tiro);
    tiro.player = this;
    this.cooldown = 1;
    if(audiolib && key) audiolib.play(key,vol);
}

Player.prototype.die = function() {
    this.alive = false;
    document.dispatchEvent(event);
};

Player.prototype.receberPontos = function (pontos) {
    this.pontos += pontos;
}

Player.prototype.receberDano = function (dano) {
    this.hp -= dano;
    if(this.hp <= 0) this.die();
}


Player.prototype.resolveColision = function (alvo){
    if ((alvo instanceof Shot) && alvo.player == this) {
        console.log("asdfasfsfadsf");
        return;
    }
    this.receberDano(alvo.dano);
    this.receberPontos(alvo.pontos);
};

Player.prototype.addListener = function(){
    var that = this;
    addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case that.fireButton:
                that.fire(al, "shot", 0.5);
                break;
            case that.leftButton:
                that.sprite.vang = -100;
                break;
            case that.downButton:
                that.sprite.am = 50;
                break;
            case that.rightButton:
                that.sprite.vang = +100;
                break;
            case that.upButton:
                that.sprite.am = -50;
                break;
            default:
        }
    });
    addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case that.leftButton:
                that.sprite.vang = 0;
                break;
            case that.downButton:
                that.sprite.am = 0;
                break;
            case that.rightButton:
                that.sprite.vang = 0;
                break;
            case that.upButton:
                that.sprite.am = 0;
                break;
            default:
        }
    });
}