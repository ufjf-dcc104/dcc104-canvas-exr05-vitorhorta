function Level() {
    this.colisionObservable = null;
    this.enemies = [];
    this.shots = [];
    this.inimigosRespawn = 1;
    this.player = null;
    this.respawnCooldown = 0;
    this.maxCooldown = 1;

}

Level.prototype.init = function () {
    this.respawn();
};

Level.prototype.respawn = function () {
    if (this.respawnCooldown > 0) return;
    for (var i = 0; i < 3; i++) {
        var inimigo = new Enemy();
        inimigo.sprite.x = 250;
        inimigo.sprite.y = 100 + 100 * i;
        inimigo.sprite.width = 64;
        inimigo.sprite.height = 64;
        inimigo.pontos = 0;
        inimigo.colisionResolver = this;
        //inimigo.vang = 300*i;
        inimigo.sprite.am = 0;
        inimigo.imgkey = "enemy";
        this.respawnCooldown = this.maxCooldown;
        this.enemies.push(inimigo);
        this.colisionObservable.add(inimigo);
    }
};

Level.prototype.mover = function (dt) {
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].mover(dt);
    }
};

Level.prototype.moverAng = function (dt) {
    if (this.respawnCooldown > 0) {
        this.respawnCooldown -= dt;
    } else {
        this.respawnCooldown = 0;
    }
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].moverAng(dt);
    }
};

Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].desenhar(ctx);
    }
};
Level.prototype.desenharImg = function (ctx) {
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].desenharImg(ctx, this.imageLib.images[this.enemies[i].imgkey]);
    }
};

Level.prototype.colidiuCom = function (alvo, resolveColisao) {
    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].sprite.colidiuCom(alvo)) {
            resolveColisao(this.enemies[i], alvo);
        }
    }
};


Level.prototype.resolveColision = function (inimigo,alvo){
    // if (alvo instanceof Enemy) return;
    // var key = "boom";
    // x = this.enemies.indexOf(inimigo);
    // this.enemies.splice(x, 1);
    // this.colisionObservable.remove(inimigo);
    // if (al && key) al.play(key);
}

Level.prototype.perseguir = function (alvo, dt) {
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].perseguir(alvo, dt);
    }
};
Level.prototype.perseguirAng = function (alvo, dt) {
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].perseguirAng(alvo, dt);
    }
};