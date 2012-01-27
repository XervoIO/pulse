describe("Engine", function() {

  it("should be able to be constructed without any params", function() {
    jasmine.getFixtures().set('<div id="gameWindow"></div>');

    var e = new pulse.Engine();

    expect(e).toBeDefined();
  });

  it("should be able to be constructed with param object with game window set", function() {
    jasmine.getFixtures().set('<div id="testWindow"></div>');

    var e = new pulse.Engine({gameWindow: 'testWindow'});
    var tw = document.getElementById('testWindow');

    expect(e.gameWindow).toBe(tw);
  });
});