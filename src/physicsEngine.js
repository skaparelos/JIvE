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

    }


    update(dt) {
        var start = Date.now();

        this.world.Step(
            JIVE.settings.frame_rate,   //frame-rate
            8,   //velocity iterations
            4    //position iterations
        );
        this.world.ClearForces();
        this.body.SetLinearVelocity(new this.b2Vec2(20, 0));

        return(Date.now() - start);
    }

    init(ctx){
        //TODO this is temporary
        this.scale = 20;
        this.setupDebugDraw(ctx);
        this.createRectangularBody(500, 200, 40, 40, true);
        this.createRectangularBody(10, 200, 70, 20, false);
    }


    addBody(entDef){

    }

    deleteBody(){

    }

    /* TODO
    getBodyAtMouse(e) {
        var mouseX = e.clientX/this.scale;
        var mouseY = e.clientY/this.scale;
        this.mousePVec = new this.b2Vec2(mouseX, mouseY);
        var aabb = new this.b2AABB();
        aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

        // Query the world for overlapping shapes.

        this.selectedBody = null;
        this.world.QueryAABB(this.getBodyCB, aabb);
        return this.selectedBody;
    }

    getBodyCB(fixture) {
        if(fixture.GetBody().GetType() !== this.b2Body.b2_staticBody) {
            if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), this.mousePVec)) {
                this.selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }
    */

    createRectangularBody(x, y, w, h, isStatic){
        var bodyDef = new this.b2BodyDef;
        if (isStatic)
            bodyDef.type = this.b2Body.b2_staticBody;
        else
            bodyDef.type = this.b2Body.b2_dynamicBody;
        bodyDef.position.x = x/this.scale;
        bodyDef.position.y = y/this.scale;

        var fixtureDef = new this.b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.3;

        fixtureDef.shape = new this.b2PolygonShape;
        fixtureDef.shape.SetAsBox(w/this.scale, h/this.scale);

        this.body = this.world.CreateBody(bodyDef);
        this.body.CreateFixture(fixtureDef);
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