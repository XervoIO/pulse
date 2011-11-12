var mm = mm || {};

mm.Megaman = PFPlay.Sprite.extend({
  init : function(params) {
    params = {};
    params.src = mm.Megaman.texture;
    
    this._super(params);

    this.anchor = {
      x : 0.5,
      y : 1.0
    };

    this.size = {
      width : 55,
      height : 60
    }

    var animationFrameRate = 20;
    var _self = this;

    this.textureFrame.width = 55;
    this.textureFrame.height = 60;

    this._private.oframe = {
      x: 0,
      y: 0,
      width : 55,
      height : 60
    };

    this.state = mm.Megaman.State.Idle;

    this._private.statePrevious = mm.Megaman.State.Idle;

    this.direction = mm.Megaman.Direction.Right;

    this._private.directionPrevious = mm.Megaman.Direction.Right;

    var introAction = new PFPlay.AnimateAction({
      name : 'intro', 
      size : {width:55, height:60}, 
      frames : [22,22,22,22,23,24,25,26,27,28,29], 
      frameRate : animationFrameRate,
      plays : 1
    });
    introAction.events.bind('complete', function(){
      _self.state = mm.Megaman.State.Idle;
    });

    this.addAction(introAction);

    var runningAction = new PFPlay.AnimateAction({
      name : 'running', 
      size : {width:55, height:60}, 
      frames : [7,8,9,10,11,12,13,14,15,16], 
      frameRate : animationFrameRate
    });

    this.addAction(runningAction);

    var jumpAction = new PFPlay.AnimateAction({
      name : 'jumping', 
      size : {width:55, height:60}, 
      frames : [17,18,19,20,21], 
      frameRate : animationFrameRate,
      plays : 1
    });

    this.addAction(jumpAction);

    var smileAction = new PFPlay.AnimateAction({
      name : 'smile', 
      size : {width:55, height:60}, 
      frames : [1,2,3,4,5,6], 
      frameRate : animationFrameRate,
      plays : 1
    });
    smileAction.events.bind('complete', function(){
      _self.state = mm.Megaman.State.Idle;
    });

    this.addAction(smileAction);
  },

  reset : function() {
    for(var n in this.runningActions) {
      this.runningActions[n].stop();
    }
  },

  update : function(elapsed) {
    this._super(elapsed);

    if(this.state != this._private.statePrevious) {
      this.updateState(this.state);
      this._private.statePrevious = this.state;
    }

    if(this.direction != this._private.directionPrevious) {
      this.scale.x = this.direction;
      this._private.directionPrevious = this.direction;
    }
  },

  updateState : function(state) {
    this.reset();

    switch(state) {
      case mm.Megaman.State.Idle:
        this.textureFrame = this._private.oframe;
        this.updated = true;
        break;
      case mm.Megaman.State.Intro:
        this.runAction('intro', this._private.oframe);
        break;
      case mm.Megaman.State.Running:
        this.runAction('running', this._private.oframe);
        break;
      case mm.Megaman.State.Jumping:
        this.runAction('jumping');
        break;
      case mm.Megaman.State.Smile:
        this.runAction('smile', this._private.oframe);
        break;
    }
  }

});

mm.Megaman.State = {};
mm.Megaman.State.Idle = 'idle';
mm.Megaman.State.Intro = 'intro';
mm.Megaman.State.Running = 'running';
mm.Megaman.State.Jumping = 'jumping';
mm.Megaman.State.Smile = 'smiling';

mm.Megaman.Direction = {};
mm.Megaman.Direction.Right = 1;
mm.Megaman.Direction.Left = -1;

mm.Megaman.texture = new PFPlay.Image({src: 'man.png'});