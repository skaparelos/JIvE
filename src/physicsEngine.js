class PhysicsEngine{

    constructor(){

        // Declare all the commonly used objects as variables for convenience
        this.b2World = Box2D.Dynamics.b2World;
        this.b2Vec2 = Box2D.Common.Math.b2Vec2;
        this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
        this.b2Body = Box2D.Dynamics.b2Body;
        this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        this.b2Fixture = Box2D.Dynamics.b2Fixture;
        this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
        this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        this.b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
        this.b2AABB = Box2D.Collision.b2AABB;
        this.b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

        this.world = new this.b2World(
            new this.b2Vec2(0, 0), // we don't need gravity
            false // set sleeping to false
        );

        this.scale = 60;
    }


    update() {
        var start = Date.now();

        this.world.Step(
            JIVE.settings.frame_rate,   //frame-rate
            8,   //velocity iterations
            4    //position iterations
        );
        this.world.ClearForces();
        return(Date.now() - start);
    }


    init(ctx){
        this.setupDebugDraw(ctx);
    }


    addBody(entDef){
        if (entDef.shape === "rectangle"){
            return this.createRectangle(entDef);
        }
    }

    deleteBody(){

    }

    /*
    // TODO
    getBodyAtMouse(e) {
        var mouseX = e.clientX/this.scale;
        var mouseY = e.clientY/this.scale;
        mousePVec = new this.b2Vec2(mouseX, mouseY);
        var aabb = new this.b2AABB();
        aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

        // Query the world for overlapping shapes.

        selectedBody = null;
        this.world.QueryAABB(this.getBodyCB, aabb);
        return selectedBody;
    }

    getBodyCB(fixture) {
        if(fixture.GetBody().GetType() !== b2Body.b2_staticBody) {
            if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }
    */

    createRhombus(entDef){

    }

    createRectangle(entDef){
        var bodyDef = new this.b2BodyDef;
        if (entDef.isStatic)
            bodyDef.type = this.b2Body.b2_staticBody;
        else
            bodyDef.type = this.b2Body.b2_dynamicBody;
        bodyDef.position.x = entDef.x/this.scale;
        bodyDef.position.y = entDef.y/this.scale;

        var fixtureDef = new this.b2FixtureDef;
        fixtureDef.density = entDef.density;
        fixtureDef.friction = entDef.friction;
        fixtureDef.restitution = entDef.restitution;

        fixtureDef.shape = new this.b2PolygonShape;
        fixtureDef.shape.SetAsBox(entDef.width/this.scale, entDef.height/this.scale);

        var body = this.world.CreateBody(bodyDef);
        body.SetUserData(entDef);
        body.CreateFixture(fixtureDef);
        return body;
    }


    setupDebugDraw(ctx){
        var debugDraw = new this.b2DebugDraw();

        // Use this canvas context for drawing the debugging screen
        debugDraw.SetSprite(ctx);

        // Set the scale
        debugDraw.SetDrawScale(this.scale);

        // Fill boxes with an alpha transparency of 0.3
        debugDraw.SetFillAlpha(0.3);

        // Draw lines with a thickness of 1
        debugDraw.SetLineThickness(1.0);

        // Display all shapes and joints
        debugDraw.SetFlags(this.b2DebugDraw.e_shapeBit | this.b2DebugDraw.e_jointBit);

        // Start using debug draw in our world
        this.world.SetDebugDraw(debugDraw);
    }

    draw(){
        this.world.DrawDebugData();
    }
}

/*
TODO
var b2Body = Box2D.Dynamics.b2Body;
var mousePVec = null;
var selectedBody = null;
*/